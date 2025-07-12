import Sidebar from "../components/Sidebar";
import Editor from "../components/Editor";

export default function Home() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <Editor />
    </div>
  );
}
