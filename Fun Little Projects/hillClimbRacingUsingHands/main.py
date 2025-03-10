import cv2
import mediapipe as mp
from pynput.keyboard import Key, Controller
import subprocess
import time

# Launch the game using subprocess.Popen so we can track its process.
# Use a raw string for Windows paths.
game_path = r"C:\Program Files\WindowsApps\FINGERSOFT.HILLCLIMBRACING_1.41.1.0_x86__r6rtpscs7gwyg\HillClimbRacing.exe"
game_process = subprocess.Popen([game_path])

mp_drawing = mp.solutions.drawing_utils
mp_hands = mp.solutions.hands

keyboard = Controller()
cap = cv2.VideoCapture(0)

def is_hand_open(hand_landmarks, handedness):
    fingers = []
    tip_ids = [4, 8, 12, 16, 20]  # Thumb, Index, Middle, Ring, Pinky

    # Check the four fingers (index to pinky)
    for i in range(1, 5):
        # A finger is considered open if its tip is above its pip joint (using y-axis)
        if hand_landmarks.landmark[tip_ids[i]].y < hand_landmarks.landmark[tip_ids[i] - 2].y:
            fingers.append(1)
        else:
            fingers.append(0)

    # Adjust thumb check based on handedness
    if handedness == "Right":
        # For right hand, thumb is open if its tip is to the left of its joint
        if hand_landmarks.landmark[tip_ids[0]].x < hand_landmarks.landmark[tip_ids[0] - 1].x:
            fingers.append(1)
        else:
            fingers.append(0)
    else:  # "Left"
        # For left hand, thumb is open if its tip is to the right of its joint
        if hand_landmarks.landmark[tip_ids[0]].x > hand_landmarks.landmark[tip_ids[0] - 1].x:
            fingers.append(1)
        else:
            fingers.append(0)

    # Consider the hand open if 4 or more fingers are extended.
    open_status = sum(fingers) >= 4
    return handedness, open_status

with mp_hands.Hands(model_complexity=0, min_detection_confidence=0.5, 
                    min_tracking_confidence=0.5, max_num_hands=2) as hands:
    while cap.isOpened():
        # Check if the game is still running.
        if game_process.poll() is not None:
            print("Game has been closed. Exiting program loop.")
            break

        success, image = cap.read()
        if not success:
            print("Ignoring empty camera frame.")
            break

        # Process the image (flip and convert color)
        image = cv2.cvtColor(cv2.flip(image, 1), cv2.COLOR_BGR2RGB)
        image.flags.writeable = False
        results = hands.process(image)
        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        # Initialize flags for each hand
        left_open = False
        right_open = False

        if results.multi_hand_landmarks and results.multi_handedness:
            # Process each detected hand along with its handedness info
            for hand_landmarks, hand_label_obj in zip(results.multi_hand_landmarks, results.multi_handedness):
                hand_label = hand_label_obj.classification[0].label  # "Left" or "Right"
                _, open_status = is_hand_open(hand_landmarks, hand_label)

                # Update flags based on which hand is open
                if hand_label == "Left" and open_status:
                    left_open = True
                elif hand_label == "Right" and open_status:
                    right_open = True

                # Draw landmarks on each hand
                mp_drawing.draw_landmarks(
                    image, 
                    hand_landmarks, 
                    mp_hands.HAND_CONNECTIONS
                )

        # Decide action based on which hand is open:
        # Only left hand open → press the right key.
        # Only right hand open → press the left key.
        # If both or neither are open, release both keys.
        if left_open and not right_open:
            keyboard.press(Key.right)
            keyboard.release(Key.left)
            print("Left hand open: Pressing right key")
        elif right_open and not left_open:
            keyboard.press(Key.left)
            keyboard.release(Key.right)
            print("Right hand open: Pressing left key")
        else:
            # Release both keys when both or neither are open
            keyboard.release(Key.left)
            keyboard.release(Key.right)
            print("Both hands open or both closed: No action")

        cv2.imshow('MediaPipe Hands', image)
        # Use a short delay to allow the window to update.
        if cv2.waitKey(5) & 0xFF == 27:  # Escape key to exit manually
            break

# At this point the game has closed, so we break out of the loop.
cap.release()

# Instead of immediately destroying the window, wait for a key press.
print("Press any key in the OpenCV window to exit.")
cv2.waitKey(0)
cv2.destroyAllWindows()
