#!/bin/bash
python.exe -m uvicorn gdp-poc.backend.main:app --reload --host 0.0.0.0 --port 8000
