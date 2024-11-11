import requests
import json
from typing import Dict, Any
import sys

BASE_URL = "http://localhost:8000"

def test_endpoint(endpoint: str, expected_status: int = 200) -> Dict[str, Any]:
    """
    Test an endpoint and return the result
    """
    try:
        response = requests.get(f"{BASE_URL}{endpoint}")
        status = "✅" if response.status_code == expected_status else "❌"
        return {
            "endpoint": endpoint,
            "status_code": response.status_code,
            "expected_status": expected_status,
            "success": status,
            "response": response.json() if response.status_code == 200 else response.text
        }
    except requests.RequestException as e:
        return {
            "endpoint": endpoint,
            "expected_status": expected_status,
            "status_code": None,
            "success": "❌",
            "response": str(e)
        }

def print_result(result: Dict[str, Any]) -> None:
    """
    Print the test result in a formatted way
    """
    print(f"\n{'-'*50}")
    print(f"Testing: {result['endpoint']}")
    print(f"Status: {result['success']} (Got: {result['status_code']}, Expected: {result['expected_status']})")
    if result['success'] == "❌":
        print(f"Error: {result['response']}")
    elif result['status_code'] == 200:
        print("Response data received successfully")
    print(f"{'-'*50}\n")

def main():
    # Test cases using the sample data from generate_db.py
    test_cases = [
        # Test existing resources (expecting 200)
        ("/applicants/john@example.com", 200),
        ("/applicants/jane@example.com", 200),
        ("/businesses/tech@company.com", 200),
        ("/businesses/retail@store.com", 200),
        ("/jobs/1", 200),
        ("/jobs/2", 200),
        ("/jobs/1/applicants", 200),
        ("/applicants/john@example.com/matching-jobs", 200),
        ("/businesses/tech@company.com/jobs", 200),
        ("/jobs", 200),
        ("/applicants/john@example.com/applications", 200),
        
        # Test non-existing resources (expecting 404)
        ("/applicants/nonexistent@example.com", 404),
        ("/businesses/nonexistent@example.com", 404),
        ("/jobs/999", 404),
        ("/jobs/999/applicants", 404),
        ("/applicants/nonexistent@example.com/matching-jobs", 404),
        ("/businesses/nonexistent@example.com/jobs", 404)
    ]

    print("🔍 Starting API Tests...")
    
    success_count = 0
    total_tests = len(test_cases)

    for endpoint, expected_status in test_cases:
        result = test_endpoint(endpoint, expected_status)
        print_result(result)
        if result['success'] == "✅":
            success_count += 1

    # Print summary
    print(f"\n📊 Test Summary:")
    print(f"Total Tests: {total_tests}")
    print(f"Successful: {success_count}")
    print(f"Failed: {total_tests - success_count}")
    
    # Calculate success percentage
    success_percentage = (success_count / total_tests) * 100
    print(f"Success Rate: {success_percentage:.1f}%")
    
    # Return non-zero exit code if any test failed
    if success_count != total_tests:
        print("\n❌ Some tests failed!")
        sys.exit(1)
    else:
        print("\n✅ All tests passed!")

if __name__ == "__main__":
    main()