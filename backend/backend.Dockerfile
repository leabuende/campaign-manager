FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
  build-essential \
  python3-dev \
  libffi-dev \
  libssl-dev \
  && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies
COPY requirements.txt ./requirements.txt
RUN pip install --upgrade pip \
  && pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

RUN mkdir -p /app/uploads

EXPOSE 8001

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
