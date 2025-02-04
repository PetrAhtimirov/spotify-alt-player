import Header from "../features/header/Header.tsx";
import PlaybackControllers from "../features/playbackControllers/PlaybackControllers.tsx";

const App = () => {
  return (
    <div className="app">
      <Header />
      <div className="app__content">
        <div className="app__content__first">first</div>
        <div className="app__content__second">second</div>
      </div>
      <div className="app__player">
        <div></div>
        <PlaybackControllers />
        <div></div>
      </div>
    </div>
  )
}

export default App;