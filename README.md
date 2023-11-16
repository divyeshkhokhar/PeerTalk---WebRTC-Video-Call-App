# PeerTalk---WebRTC-Video-Call-App

PeerTalk is a WebRTC-based video call application that allows users to initiate and join video calls through a simple interface.

## Installation

1. Ensure you have Node.js installed on your machine.
2. Clone the repository to your local machine:

    ```bash
    git clone https://github.com/divyeshkhokhar/PeerTalk---WebRTC-Video-Call-App
    ```

3. Navigate to the project directory:

    ```bash
    cd PeerTalk
    ```

4. Install the required dependencies:

    ```bash
    npm install websocket
    ```

## Usage

### Starting the Server

1. Run the server using Node.js:

    ```bash
    node server.js
    ```

### Initiating a Call

1. Open `videoapp.html` in a web browser.
2. Enter your desired username in the provided input field.
3. Click on the "Initiate Call" button to create an offer and establish a connection.
   - **Note**: Upon initiation, the server-side console might display a message such as `Username: (xyz) created a call request`, providing confirmation that the call request was successfully processed by the Node.js server.
4. Once initiated, use the "Start Call" button to begin the video call.
5. Grant necessary permissions for camera and microphone access if prompted.
6. You should now be connected and able to communicate via video with the other peer.


### Joining a Call

1. Open another tab or window in the same browser.
2. Open the same `videoapp.html` file.
3. Enter the same username used in the initiating call tab.
4. Click on the "Join Call" button to connect to the existing peer.
5. You should now be connected and able to communicate via video with the other peer.

## Technologies Used

- **WebRTC**: Real-time communication between browsers.
- **WebSocket**: For signaling and communication between peers.
- **HTML/CSS/JavaScript**: Front-end development.
- **Node.js**: Setting up the signaling server for backend functionality.

## Contributors

- [Divyesh Khokhar](https://github.com/divyeshkhokhar)

