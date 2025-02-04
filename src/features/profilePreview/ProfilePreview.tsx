import { fetchUser } from "./profileSlice";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router";
import logout_icon from "../../../assets/icons/logout.svg";
import external_link_logo from "../../../assets/icons/external_link.svg";
import { RootState, AppDispatch } from "../../store";

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

const ProfilePreview = () => {
  const { userLoadingStatus, display_name, images, id } = useTypedSelector((state) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const onLogout = () => {
    localStorage.removeItem("access_token");
    window.location.href = "/preview";
  };

  return (
    <>
      {userLoadingStatus === "loading" ? (
        <div className="user_preview is_loading"></div>
      ) : (
        <div className="user_preview__wrapper">
          <button ref={buttonRef} className={`user_preview ${isOpen ? "open" : ""}`} onClick={() => setIsOpen((prev) => !prev)}>
            {images.length !== 0 ? <img src={images[0].url} alt="profile image" className="use_preview__image" /> : null}
            <span>{display_name}</span>
          </button>
            <div className={`user_menu ${isOpen ? "open" : ""}`} ref={menuRef}>
              <Link className="user_menu__item link" to={`https://open.spotify.com/user/${id}`} target="_blank">
                Profile
                <img src={external_link_logo} className="user_menu__item_icon" alt="" />
              </Link>
              <hr className="user_menu__divider" />
              <button className="user_menu__item" onClick={onLogout}>
                Logout
                <img src={logout_icon} className="user_menu__item_icon" alt="" />
              </button>
            </div>
        </div>
      )}
    </>
  );
};

export default ProfilePreview;
