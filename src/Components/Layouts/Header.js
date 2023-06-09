import React, { useContext } from "react";
import { FaUniversity } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import UserContext from "../../Hooks/UserContext";
import { toast } from "react-toastify";

const Header = () => {
  const { setUser } = useContext(UserContext);
  const logout = () => {
    setUser("");
    toast.info("Logged Out");
  };
  return (
    <header className="header">
      <NavLink to="/dash" className="header__profile">
        <FaUniversity />
        <h1 className="header__h1">Kollege</h1>
      </NavLink>
      <NavLink to="./" className="header__profile" onClick={() => logout()}>
        <p>Logout&nbsp;</p>
        <FiLogOut />
      </NavLink>
    </header>
  );
};

export default Header;
