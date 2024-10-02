import React, { useContext, useEffect, useState } from "react";
import "./landing.css";
import Coins from "../../img/coins.png";
import Kuttu from "../../img/avarat.png";
import { Button, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue } from "firebase/database";
import { UserContext } from "../../context/UserContext";

function Landing() {
  const { user } = useContext(UserContext);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const db = getDatabase();
    const usersRef = ref(db, "users/");

    onValue(usersRef, (snapshot) => {
      const usersData = snapshot.val();
      const leaderboardArray = [];
      const limit = 25;

      //let i = 0;
      for (let userId in usersData) {
        //if (i >= limit) break;
        const coins = usersData[userId]?.coins || 0;
        const username = usersData[userId]?.username;
        leaderboardArray.push({ userId, coins, username });
        //i = i + 1;
      }

      leaderboardArray.sort((a, b) => b.coins - a.coins);
      setLeaderboard(leaderboardArray);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <Spin size="large"></Spin>
      </div>
    );
  }

  return (
    <div className="veed">
      <div className="landhead">
        {!user && (
          <div className="landcoins">
            <div className="logreg">
              <Button onClick={() => navigate("/login")}>Login</Button>
            </div>
            <div className="guides">
              <Button
                onClick={() =>
                  (window.location.href =
                    "https://docs.google.com/document/d/1QBY1bny1GD_hHFfipLijo11GzAATSq-zw7fFeUztihQ/edit?usp=sharing")
                }
              >
                See Guidelines
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="landlead">
        <h3>Leaderboard</h3>
        {leaderboard.map((user, index) => (
          <div className="leaders" key={index}>
            <h3>{index + 1}</h3>
            <div className="leaddet">
              <img src={Kuttu} alt="Kuttu" />
              <p>@{user.username}</p>
              <div className="mejoin-coins">
                <img className="nanayam" src={Coins} alt="coiner" />
                <h3>{user.coins}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Landing;
