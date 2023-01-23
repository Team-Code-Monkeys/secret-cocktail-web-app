import React, { useEffect, useState } from "react";
import Navbar from "../navbar";
import styles from "./styles.module.css";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { setupAuthListener } from "../authredirect/setup-auth-listener";
import firebaseApp from "../firebase";
import {
  checkedIfAllowedOnPage,
  k_admin_role,
} from "../authredirect/auth-check";
import { k_admin_portal_page_route } from "../index";
import {
  collection,
  getDocs,
  query,
  where,
  getFirestore,
  deleteDoc,
  doc,
} from "firebase/firestore";

function AdminFacilities() {
  const auth = getAuth(firebaseApp);
  const navigate = useNavigate();
  const db = getFirestore();

  const [facilities, setFacilities] = useState<any>([]);

  useEffect(() => {
    checkedIfAllowedOnPage(auth, navigate, [k_admin_role]);
    setupAuthListener(auth, navigate, true, false);
  }, [auth, navigate]);

  useEffect(() => {
    async function fetchFacilities() {
      const q = query(collection(db, "facility"), where("name", ">=", ""));
      const querySnapshot = await getDocs(q);
      const facilitiesList: any = [];
      querySnapshot.forEach((doc) => {
        const facility = doc.data();
        facility.id = doc.id;
        facilitiesList.push(facility);
      });
      setFacilities(facilitiesList);
    }

    fetchFacilities();
  }, [db]);

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.innerContainer}>
        <div className={styles.title}>Facility Dashboard</div>
      </div>
      <div className={styles.innerContainer3}>
        {facilities.map((facility: any) => {
          return (
            // <div className={styles.pageInnerContainer} key={facility.id}>
            //   <div className={styles.pageTitle}>{facility.name}</div>
            //   <div className={styles.pageSubtitle}>{facility.address}</div>
            //   <div className={styles.pageSubtitle}>{facility.phone}</div>
            // </div>

            <div className={styles.listItemContainer} key={facility.id}>
              <div className={styles.listItemText2}>
                NAME: {facility.name || "No text"}
              </div>
              <div className={styles.listItemText2}>
                ADDRESS: {facility.address || "No text"}
              </div>
              <div className={styles.listItemText2}>
                PHONE: {facility.phone || "No text"}
              </div>
              <div className={styles.listItemButtonsContainer}>
                <button
                  style={{ border: "#e13d3d", background: "#e13d3d" }}
                  className={styles.primaryBtnListView}
                  onClick={() => {
                    deleteDoc(doc(db, "facility", facility.id || ""))
                      .then(() => {
                        window.location.reload();
                      })
                      .catch((error: any) => {
                        alert("Error deleting facility.");
                        console.error("Error deleting facility", error);
                      });
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles.innerContainer}>
        <div
          className={styles.backBtnContainer}
          onClick={() => {
            navigate(k_admin_portal_page_route);
          }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M27 20H13"
              stroke="#5C5C5C"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20 27L13 20L20 13"
              stroke="#5C5C5C"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className={styles.backBtnText}>Back</div>
        </div>
      </div>
    </div>
  );
}

export default AdminFacilities;
