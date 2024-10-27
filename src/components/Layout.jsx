import { useState } from "react";
import React from "react";
import Modal from "./Modal";
import Authentication from "./Authentication";
import { useAuth } from "../context/AuthContext";

export default function Layout(props) {
  const { children } = props;

  const [showModal, setShowModal] = useState(false);

  const {globalUser, logout} = useAuth();

  const header = (
    <header>
      <div>
        <h1 className="text-gradient">CAFFEIND</h1>
        <p>For Coffee Insatiates</p>
      </div>
      {globalUser ? (
                <button onClick={logout}>
                    <p>Logout</p>
                </button>
            ) : (
        <button onClick={() => {
        setShowModal(true);
      }}>
        <p>Sign up free</p>
        <i className="fa-solid fa-mug-hot"></i>
      </button>
    )}
    </header>
  );

  const footer = (
    <footer>
      <p>
        <span className="text-gradient">Caffeind</span> was made by{" "}
        <a href="https://www.github.com" target="_blank">
          Mjy54
        </a>{" "}
        <br /> using the{" "}
        <a href="https://www.fantacss.smoljames.com" target="_blank">
          FantaCSS
        </a>{" "}
        design library.
        <br />
        Check out the project on{" "}
        <a target="_blank" href="https:www.github.com/mj2457">
          Github
        </a>
        !
      </p>
    </footer>
  );

  function handleCloseModal() {
    setShowModal(false);
  }

  return (
    <>
      {showModal && (
                <Modal handleCloseModal={handleCloseModal}>
                    <Authentication handleCloseModal={handleCloseModal} />
                </Modal>
      )}
      {header}
      <main>{children}</main>
      {footer}
    </>
  );
}
