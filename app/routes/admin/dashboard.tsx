import { Header } from "components";

const Dashboard = () => {
  const user = {
    name: "Saad",
  };
  return (
    <main className="dashboard wrapper">
      <Header
        title={`Welcome ${user.name}`}
        description="Track activities, trends and popular destinations in realtime"
      />
    </main>
  );
};

export default Dashboard;
