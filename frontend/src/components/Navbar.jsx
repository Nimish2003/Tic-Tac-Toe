import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FiMenu, FiArrowRight, FiLogOut } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  return (
    <div>
      <FlipNav />
    </div>
  );
};

const FlipNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    // Clear the localStorage and set the loggedIn state to false
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <nav className="bg-[#3f0877] p-4 flex items-center justify-between relative">
      <NavLeft setIsOpen={setIsOpen} />
      <NavRight isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <NavMenu isOpen={isOpen} />
    </nav>
  );
};

const Logo = () => {
  return (
    <svg
      width="50"
      height="39"
      viewBox="0 0 50 39"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="fill-gray-800"
    >
      <path
        d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z"
        stopColor="#000000"
      ></path>
      <path
        d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z"
        stopColor="#000000"
      ></path>
    </svg>
  );
};

const NavLeft = ({ setIsOpen }) => {
  return (
    <div className="flex items-center gap-6">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="block lg:hidden text-gray-950 text-2xl"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <FiMenu />
      </motion.button>
      {/* <NavLink text="Dashboard" link="/dashboard" /> */}
      <NavLink text="Create Room" link="create-room" />
      <NavLink text="Join Room" link="join-room" />
      <NavLink text="History" link="history" />
    </div>
  );
};

const NavLink = ({ text, link }) => {
  return (
    <Link
      to={link}
      className="hidden lg:block h-[30px] overflow-hidden font-medium"
    >
      <motion.div whileHover={{ y: -30 }}>
        <span className="flex items-center h-[30px] text-red-300 ">{text}</span>
        <span className="flex items-center h-[30px] text-pink-600 ">{text}</span>
      </motion.div>
    </Link>
  );
};

const NavRight = ({ isLoggedIn, onLogout }) => {
  return (
    <div className="flex items-center gap-4">
      {isLoggedIn ? (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-gradient-to-r from-orange-700 to-pink-500 text-white font-medium rounded-md whitespace-nowrap cursor-pointer"
          onClick={onLogout}
        >
          <FiLogOut className="inline mr-2" /> Logout
        </motion.div>
      ) : (
        <>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-orange-700 to-pink-500 text-white font-medium rounded-md whitespace-nowrap"
          >
            <Link to="/login">Sign in</Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-orange-700 to-pink-500 text-white font-medium rounded-md whitespace-nowrap"
          >
            <Link to="/signup">Sign up</Link>
          </motion.div>
        </>
      )}
    </div>
  );
};

const NavMenu = ({ isOpen }) => {
  return (
    <motion.div
      variants={menuVariants}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      className="absolute p-4 bg-white shadow-lg left-0 right-0 top-full origin-top flex flex-col gap-4"
    >
      <MenuLink text="Home" link="/" />
    </motion.div>
  );
};

const MenuLink = ({ text, link }) => {
  return (
    <Link
      to={link}
      className="h-[30px] overflow-hidden font-medium text-lg flex items-start gap-2"
    >
      <motion.span variants={menuLinkArrowVariants}>
        <FiArrowRight className="h-[30px] text-gray-950" />
      </motion.span>
      <motion.div whileHover={{ y: -30 }}>
        <span className="flex items-center h-[30px] text-gray-500">{text}</span>
        <span className="flex items-center h-[30px] text-indigo-600">{text}</span>
      </motion.div>
    </Link>
  );
};

export default Navbar;

const menuVariants = {
  open: {
    scaleY: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  closed: {
    scaleY: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.1,
    },
  },
};

const menuLinkVariants = {
  open: {
    y: 0,
    opacity: 1,
  },
  closed: {
    y: -10,
    opacity: 0,
  },
};

const menuLinkArrowVariants = {
  open: {
    x: 0,
  },
  closed: {
    x: -4,
  },
};
