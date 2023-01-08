import { observer } from "mobx-react-lite";
import { Calendar } from "react-calendar";
import { Menu, Header } from "semantic-ui-react";
import ActivityStore from "../../../App/stores/activityStore";
import { useStore } from "../../../App/stores/store";

export default observer(function ActivityFilters() {
  const {
    activityStore: { predicate, setPredicate },
  } = useStore();
  return (
    <>
      <Menu vertical size="large" style={{ width: "100%", marginTop: 25 }}>
        <Header icon="filter" attached color="teal" content="Filters"></Header>
        <Menu.Item
          content="All Activities"
          active={predicate.has("all")}
          onClick={() => setPredicate("all", "true")}
        ></Menu.Item>
        <Menu.Item
          content="I'm going"
          active={predicate.has("isGoing")}
          onClick={() => setPredicate("isGoing", "true")}
        ></Menu.Item>
        <Menu.Item
          content="I'm hosting!"
          active={predicate.has("isHost")}
          onClick={() => setPredicate("isHost", "true")}
        ></Menu.Item>
      </Menu>
      <Header></Header>
      <Calendar
        onChange={(date: any) => setPredicate("startDate", date as Date)}
        value={predicate.get("startDate") || new Date()}
      ></Calendar>
    </>
  );
});
