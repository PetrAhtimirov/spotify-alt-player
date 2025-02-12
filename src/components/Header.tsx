import ProfilePreview from "./ProfilePreview.tsx";

const Header = () => {
  return (
    <div className="app__header">
      <span className="header__brand">Spotify / alt player</span>
      <ProfilePreview />
    </div>
  )
}

export default Header;