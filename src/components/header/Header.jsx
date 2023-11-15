import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { SlMenu } from "react-icons/sl";
import { VscChromeClose } from "react-icons/vsc";
import { useNavigate, useLocation } from "react-router-dom";

import "./header.scss";

import ContentWrapper from "../contentWrapper/ContentWrapper";
import logo from "../../assets/movix-logo.svg";

const Header = () => {
    const [show, setShow] = useState("top");// to control the navbar class
    const [lastScrollY, setLastScrollY] = useState(0); // to store the scrolling value
    const [mobileMenu, setMobileMenu] = useState(false);// to show the menu on mobile and menu icons
    const [query, setQuery] = useState("");
    const [showSearch, setShowSearch] = useState("");// to handle the search icon and input of search
    const navigate = useNavigate();
    const location = useLocation(); // store the location or url of the current page

    // used this to reset to starting of the page bcz react is a single page app so if the first page had some scroll second page will also have that
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [location])

    useEffect(() => {
      const controlNavbar = () => {
        if(window.scrollY > 200){
          if(window.scrollY > lastScrollY && !mobileMenu){
            setShow("hide");
          }else{
            setShow("show");
          }
        }else{
          setShow("top");
        }
        setLastScrollY(window.scrollY);
      };

      window.addEventListener("scroll", controlNavbar);
      return () => {
        window.removeEventListener("scroll", controlNavbar);
      }
    }, [lastScrollY]);

    

    function searchQueryHandler(event){
      if(event.key === "Enter" && query.length > 0){
        navigate(`/search/${query}`);
        setShowSearch(false);
      }
    }

    function mobileMenuHandler(){
      setMobileMenu(!mobileMenu);
      setShowSearch(false);
    }

    function showSearchHandler(){
      setShowSearch(!showSearch);
      setMobileMenu(false);
    }

    function navigationHandler(type){
      if(type === "movie"){
        navigate("/explore/movie");
      }else{
        navigate("/explore/tv");
      }
      setMobileMenu(false);  
    } 

    // in this mobile is handled using class name so we don't have to create the list item again
    return (
        <header className={`header ${mobileMenu ? "mobileView" : ""} ${show}`}>
          <ContentWrapper>
            <div className="logo" onClick={() => navigate("/")}>
              <img src={logo} alt="logo" />
            </div>

            <ul className="menuItems">
              <li className="menuItem" onClick={() => navigationHandler("movie")}>Movies</li>
              <li className="menuItem" onClick={() => navigationHandler("tv")}>TV Shows</li>
              <li className="menuItem">
                <HiOutlineSearch onClick={showSearchHandler} />
              </li>
            </ul>

            <div className="mobileMenuItems">
              <HiOutlineSearch onClick={showSearchHandler} />
              {mobileMenu ? (<VscChromeClose onClick={mobileMenuHandler} />) : (<SlMenu onClick={mobileMenuHandler} />)}
            </div>
          </ContentWrapper>

          {showSearch && 
            (<div className="searchBar">
              <ContentWrapper>
                <div className="searchInput">
                  <input
                    id='search'
                    type="text" 
                    placeholder='Search for a movie or tv show....'
                    onKeyUp={searchQueryHandler}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <VscChromeClose onClick={showSearchHandler} />
              </ContentWrapper>
            </div>)
          }
        </header>
    );
};

export default Header;