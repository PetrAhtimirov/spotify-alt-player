import {fetchUser} from "./profileSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import logout_icon from "../../../assets/icons/logout.svg"
import external_link_logo from "../../../assets/icons/external_link.svg"
import {Link} from "react-router";
import {useState} from "react";

const ProfilePreview = () => {
  const {userLoadingStatus, display_name, images, id} = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <>
      {userLoadingStatus === "loading" ? (
        <div className="user_preview is_loading">
        </div>
      ) : (
        <div className="user_preview__wrapper">
          <button className="user_preview" onClick={() => setIsOpen((isOpen) => !isOpen)}>
            {images.length !== 0 ? <img src={images[0].url} alt="profile image" className="use_preview__image"/> : null}
            <span>{display_name}</span>
          </button>
          <div className={`user_menu ${isOpen ? "open" : ""}`}>
            <Link className="user_menu__item link" to={`https://open.spotify.com/user/${id}`} target="_blank">
              Profile
              <img src={external_link_logo} className="user_menu__item_icon" alt=""/>
            </Link>
            <hr className="user_menu__divider" />
            <button className="user_menu__item">
              Logout
              <img src={logout_icon} className="user_menu__item_icon" alt=""/>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePreview;
