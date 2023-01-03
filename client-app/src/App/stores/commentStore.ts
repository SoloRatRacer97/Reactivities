import { HubConnection, LogLevel } from '@microsoft/signalr';
import { ChatComment } from '../models/comment';
import { makeAutoObservable, runInAction } from 'mobx';
import ActivityStore from './activityStore';
import { HubConnectionBuilder } from '@microsoft/signalr/dist/esm/HubConnectionBuilder';
import { store } from './store';
export default class CommentStore {
      comments: ChatComment[] = [];
      hubConnection: HubConnection | null = null;
      
      constructor() {
            makeAutoObservable(this);
      }

      // Creating Hub connection for our frontend
      createHubConnection = (activityId: string) => {
            // If we have a selected activity:
            if (store.activityStore.selectedActivity) {
                  // Setting up a hub connection with the id, auto reconnect, login and builder
                  this.hubConnection = new HubConnectionBuilder()
                        .withUrl('http://localhost:5000/chat?activityId=' + activityId, {
                              accessTokenFactory: () => store.userStore.user?.token!
                        })
                        .withAutomaticReconnect()
                        .configureLogging(LogLevel.Information)
                        .build();
                        // Start the connection:
                  this.hubConnection.start().catch(error => console.log('Error establishing the connection: ', error))
                  // Updating the observable for loading the comments:
                  this.hubConnection.on('LoadComments', (comments: ChatComment[]) => {
                        // Recall! We need to use runInAction when updating an observable. 
                        runInAction(() => {
                              comments.forEach(comment => {
                                    comment.createdAt = new Date(comment.createdAt + 'Z')
                              })
                              this.comments = comments
                        })
                  })
                  // Updating the observable for the recieving comments:
                  this.hubConnection.on('RecieveComment', (comment: ChatComment) => {
                        runInAction(() =>{
                              comment.createdAt = new Date(comment.createdAt);
                              this.comments.unshift(comment)
                        }
                         )
                  })
            }
      }
      // Simple error catch at the end of no other paths are hit:
      stopHubConnetion = () => {
            this.hubConnection?.stop().catch(error => console.log('Error stopping connection: ' + error))
      }
      // Making a way for us to clear comments:
      clearComments = () => {
            this.comments = [];
            this.stopHubConnetion();
      }

      addComment = async (values: any) => {
            values.activityId = store.activityStore.selectedActivity?.id;
            try {
                  await this.hubConnection?.invoke('SendComment', values)
            } catch (error) {
                  console.log(error);
            }
      }
}