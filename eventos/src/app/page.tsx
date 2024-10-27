"use client"; // Make sure to include this at the top of the file

import Main from "../shared/components/main";
import { ConfirmProvider } from "material-ui-confirm";
import styles from "../shared/styles/page.module.css";
import { WebSocketProvider } from "@/shared/components/WebSocketContext";

export default function Home() {
  return (
    <main className={styles.main}>
      <ConfirmProvider>
        <WebSocketProvider>
          <Main />
        </WebSocketProvider>
      </ConfirmProvider>
    </main>
  );
}