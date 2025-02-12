import Header from "../components/Header.tsx";
import Playback from "../components/Playback.tsx";

const App = () => {
  return (
    <div className="app">
      <Header/>
      <div className="app__content">
        <div className="app__content__first">first</div>
        <div className="app__content__second">second</div>
      </div>
      <Playback/>
    </div>
  )
}

export default App;