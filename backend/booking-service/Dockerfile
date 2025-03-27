# Use a minimal Python image
FROM python:3.12-slim

# Set the working directory
WORKDIR /app

# Copy and install dependencies
COPY requirements.txt .
RUN python -m venv venv && \
    . venv/bin/activate && \
    pip install --no-cache-dir -r requirements.txt 

# Copy the application code
COPY . .

# Expose the port
EXPOSE 4003

# Run the service inside the virtual environment
CMD ["sh", "-c", ". venv/bin/activate && uvicorn main:app --host 0.0.0.0 --port 4003 --reload"]
