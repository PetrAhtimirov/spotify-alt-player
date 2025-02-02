import ProfilePreview from "../profilePreview/ProfilePreview.tsx";

const Header = () => {
  return (
    <div className="app__header">
      <span>Spotify / alt player</span>
      <ProfilePreview />
    </div>
  )
}

export default Header;