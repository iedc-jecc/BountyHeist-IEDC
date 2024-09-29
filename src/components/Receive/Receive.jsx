import React, { useContext, useState } from "react";
import { Flex, Input, Typography, message } from "antd";
import { getDatabase, ref, set, get } from "firebase/database";
import "./receive.css";
import { UserContext } from "../../context/UserContext";

const { Title } = Typography;

const Receive = () => {
  const { user, setUser } = useContext(UserContext);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (loading) return;
    setLoading(true);

    const codeRegex = /^[A-Z0-9]+$/;
    if (code.length !== 7 || !codeRegex.test(code)) {
      message.error("Invalid code.");
      setLoading(false);
      return;
    }

    message.success("Loading...");
    const db = getDatabase();
    const codeRef = ref(db, `sendCodes/${code}`);

    get(codeRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const receivedAmount = data.amount * 0.5;

          const userRef = ref(db, `users/${user.uid}/coins`);
          const newBalance = user.coins + receivedAmount;

          set(userRef, newBalance)
            .then(() => set(codeRef, null))
            .then(() => {
              message.success(
                `Coins received successfully! You've gained ${receivedAmount} coins.`
              );
              setUser((prevUser) => ({ ...prevUser, coins: newBalance }));
              setCode("");
            })
            .catch((error) => {
              console.error("Error processing transaction:", error);
              message.error("Failed to receive coins. Please try again.");
            });
        } else {
          message.error("This code is expired.");
        }
      })
      .catch((error) => {
        console.error("Error checking code:", error);
        message.error("Failed to redeem code. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="redeemdiv">
      <h3>Enter Code to Receive</h3>
      <p>Enter 7-character alphanumeric code that was generated</p>

      <Flex className="optt" gap="middle" align="flex-start" vertical>
        <Input.OTP
          length={7}
          size="large"
          onChange={(e) => setCode(e)}
          value={code}
        />
      </Flex>

      <button className="redsub" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default Receive;
