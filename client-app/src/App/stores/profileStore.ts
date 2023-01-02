import { isThisQuarter } from 'date-fns';
import { makeAutoObservable, runInAction } from 'mobx';
import { toast } from 'react-toastify';
import agent from '../api/agent';
import { Photo, Profile } from '../models/profile';
import { store } from './store';
import userStore from './userStore';
// Mobx class that handles the state management in React vs Redux. 
// 1) Handeling 

export default class ProfileStore {
      profile: Profile | null = null;
      loadingProfile = false;
      uploading = false;
      loading = false;
  
      constructor() {
          makeAutoObservable(this);
      }

      get isCurrentUser() {
            if (store.userStore.user && this.profile) {
                  return store.userStore.user.username === this.profile.username;
            }
            return  false;
      }
  
      loadProfile = async (username: string) => {
          this.loadingProfile = true;
          try {
              const profile = await agent.Profiles.get(username);
              runInAction(() => {
                  this.profile = profile;
                  this.loadingProfile = false;
              })
          } catch (error) {
              toast.error('Problem loading profile');
              runInAction(() => {
                  this.loadingProfile = false;
              })
          }
      }

      uploadPhoto = async (file: Blob) => {
        this.uploading = true;
        try {
            const response = await agent.Profiles.uploadPhoto(file);
            const photo = response.data;
            runInAction(() => {
                if (this.profile) {
                    this.profile.photos?.push(photo);
                    if (photo.isMain && store.userStore.user) {
                        store.userStore.setImage(photo.url)
                        this.profile.image = photo.url
                    }
                }
                this.uploading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.uploading = false)
        }
      }
      setMainPhoto = async (photo: Photo) => {
        this.loading = true
        try {
            await agent.Profiles.setMainPhoto(photo.id)
            store.userStore.setImage(photo.url)
            runInAction(() => {
                if (this.profile && this.profile.photos) {
                    this.profile.photos.find(p => p.isMain)!.isMain = false;
                    this.profile.photos.find(p => p.isMain)!.isMain = true;
                    this.profile.image = photo.url;
                    this.loading = false;
                }
            })
        } catch (error) {
            runInAction(() => this.loading = false);
            console.log(error);
        }
      }

      deletePhoto = async (photo: Photo) => {
        this.loading = true;
        try {
            await agent.Profiles.deletePhoto(photo.id);
            runInAction(() => {
                if (this.profile) {
                    this.profile.photos = this.profile.photos?.filter(a => a.id !== photo.id);
                    this.loading = false;
                }
            })
        } catch (error) {
            toast.error('Problem deleting photo');
            this.loading = false;
        }
    }
}