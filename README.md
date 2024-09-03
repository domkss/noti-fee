# Notifee

[Notifee](https://notifee.me) is a web service that allows users to subscribe to notifications about changes in cryptocurrency exchange withdrawal fees. Users can set a target fee threshold, and when the withdrawal fee goes below this threshold, Notifee sends a notification to the user via email.
<div align="center">
<img src="https://github.com/user-attachments/assets/ae475ca2-9525-44b1-a35a-3613e79d0baf" alt="Main page image" width="940"/>
</div>

## Features

- **Subscribe to Notifications:** Users can sign up and subscribe to receive notifications about specific cryptocurrency exchange withdrawal fees.
- **Set Fee Thresholds:** Users can set a target withdrawal fee, and Notifee will monitor the fees.
- **Email Alerts:** When the withdrawal fee goes below the set threshold, an email notification is sent to the user.
- **Save and display historical data** The average weekly withdraval fee is saved and can be displayed to the users. 

## How It Works

1. **Sign Up:** Users create an account on Notifee to start monitoring withdrawal fees.
2. **Select Exchange and Cryptocurrency:** Choose the cryptocurrency and exchange to monitor.
3. **Set Threshold:** Define the withdrawal fee threshold.
4. **Receive Notifications:** Get notified via email when the withdrawal fee drops below the defined threshold.

## Installation

To run Notifee locally, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/notifee.git
    ```

2. Navigate to the project directory:

    ```bash
    cd notifee
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Set up environment variables. Create a `.env` file in the root directory and add your configuration or configure and use infisical for the env variables.

5. Start the application:

    ```bash
    npm run dev
    ```
