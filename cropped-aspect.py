import cv2
import numpy as np
from ultralytics import YOLO
from moviepy.editor import VideoFileClip, concatenate_videoclips, ImageSequenceClip

# Load YOLO model
model = YOLO("yolov8n.pt")

# Input and output video paths
input_video_path = "/home/smayan/Downloads/Linus drops the hard R.mp4"
output_video_path = "/home/smayan/Downloads/output_final.mp4"

# Target aspect ratio (e.g., 9:16 for Shorts/Reels)
TARGET_ASPECT_RATIO = (9, 16)

# Open video
cap = cv2.VideoCapture(input_video_path)
fps = int(cap.get(cv2.CAP_PROP_FPS))
frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

# Aspect ratio calculation
target_width_ratio, target_height_ratio = TARGET_ASPECT_RATIO
target_ratio = target_width_ratio / target_height_ratio

# Store cropped frames and timestamps
cropped_frames = []
face_intervals = []
start_time = None
frame_count = 0

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break  # Stop if video ends

    frame_count += 1
    current_time = frame_count / fps  # Convert frame number to timestamp

    # Perform YOLO face detection
    results = model(frame)

    # Check if a face is detected
    face_detected = False
    for result in results:
        for box in result.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])  # Face bounding box
            face_detected = True
            break  # Process only the first detected face

    if face_detected:
        if start_time is None:
            start_time = current_time  # Start new segment

        # Crop to maintain aspect ratio around the face
        face_width = x2 - x1
        face_height = y2 - y1
        center_x = (x1 + x2) // 2
        center_y = (y1 + y2) // 2

        # Adjust crop size to maintain the target aspect ratio
        if target_ratio > (face_width / face_height):
            new_width = int(face_height * target_ratio)
            new_height = face_height
        else:
            new_width = face_width
            new_height = int(face_width / target_ratio)

        # Ensure cropping does not go out of bounds
        x1_new = max(0, center_x - new_width // 2)
        x2_new = min(frame_width, center_x + new_width // 2)
        y1_new = max(0, center_y - new_height // 2)
        y2_new = min(frame_height, center_y + new_height // 2)

        # Crop frame
        cropped_frame = frame[y1_new:y2_new, x1_new:x2_new]

        # Resize to match output aspect ratio
        output_width = int(frame_height * target_ratio)
        cropped_resized = cv2.resize(cropped_frame, (output_width, frame_height))

        # ✅ FIX: Convert BGR to RGB before storing (MoviePy requires RGB)
        cropped_resized = cv2.cvtColor(cropped_resized, cv2.COLOR_BGR2RGB)

        # Store frame in list
        cropped_frames.append((current_time, cropped_resized))

    else:
        if start_time is not None:
            face_intervals.append((start_time, current_time))  # End segment
            start_time = None

cap.release()

# Add last segment if video ends with a face
if start_time is not None:
    face_intervals.append((start_time, frame_count / fps))

# Extract only face-detected segments from original video
video_clip = VideoFileClip(input_video_path)
face_clips = [video_clip.subclip(start, end) for start, end in face_intervals]

# Combine face-detected segments
if face_clips:
    trimmed_clip = concatenate_videoclips(face_clips)

    # Save trimmed video temporarily
    temp_trimmed_video = "/home/smayan/Downloads/temp_trimmed.mp4"
    trimmed_clip.write_videofile(temp_trimmed_video, codec="libx264", fps=fps)

    # ✅ FIX: Keep frames in RGB (do NOT convert back to BGR)
    cropped_video = ImageSequenceClip([f[1] for f in cropped_frames], fps=fps)

    # Write the final cropped video
    cropped_video.write_videofile(output_video_path, codec="libx264", fps=fps)

    print(f"✅ Processed video saved as: {output_video_path}")
else:
    print("⚠️ No faces detected in the video!")

print(f"🎥 Total face-detected segments extracted: {len(face_intervals)}")
