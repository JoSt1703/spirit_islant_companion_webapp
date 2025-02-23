import requests
import re
import time
import json
from bs4 import BeautifulSoup

def fetch_spirits(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Gecko/20100101 Firefox/89.0'
    }
    session = requests.Session()
    spirits_data = {}

    # Fetch the main page for spirits
    for attempt in range(3):
        try:
            response = session.get(url, headers=headers)
            print(f"Status Code: {response.status_code}")

            if response.status_code != 200:
                print("Failed to retrieve main page")
                return {}

            # Regex to find spirit names and their links
            spirit_matches = re.findall(r'<tr>.*?<td.*?>.*?</td>.*?<td.*?>.*?</td>.*?<td.*?><a href="(/index\.php\?title=.*?)" title="(.*?)">.*?</a>', response.text, re.DOTALL)

            for link, spirit_name in spirit_matches:
                spirit_full_url = f"https://spiritislandwiki.com{link}"  # Full URL for the spirit
                # Fetch Innate and Thresholds from the spirit's page
                innates_with_thresholds = fetch_spirit_details(spirit_full_url, session, headers)
                
                # Store the data
                spirits_data[spirit_name] = innates_with_thresholds

            return spirits_data

        except requests.exceptions.ConnectionError as e:
            print(f"Connection error: {e}. Retrying...")
            time.sleep(2)

    print("Failed to retrieve main page after multiple attempts.")
    return spirits_data

def fetch_spirit_details(spirit_url, session, headers):
    innates_with_thresholds = []

    for attempt in range(3):
        try:
            response = session.get(spirit_url, headers=headers)
            print(f"Fetching details from {spirit_url} - Status Code: {response.status_code}")

            if response.status_code != 200:
                print(f"Failed to retrieve {spirit_url}")
                return innates_with_thresholds

            soup = BeautifulSoup(response.text, 'html.parser')
            innate_divs = soup.find_all('div', class_='innate')

            for innate_div in innate_divs:
                innate_name = innate_div.find('b').text.strip()

                innate_data = {
                    'Innate': innate_name,
                    'Thresholds': []
                }

                threshold_divs = innate_div.find_all('div', class_='threshold')
                for threshold_div in threshold_divs:
                    elements_info = []

                    elements_span = threshold_div.find('span', class_='thresholdelements')
                    if elements_span:
                        element_matches = elements_span.find_all('b')
                        for element in element_matches:
                            quantity_text = element.text.strip()  # Get the text

                            # Check if the text is a valid integer
                            if quantity_text.isdigit():  # Check if the text is a digit
                                quantity = int(quantity_text)  # Convert to int
                                element_link = element.find_next('a')  # The <a> tag following <b>
                                if element_link:
                                    element_name = element_link['title']  # Element name
                                    elements_info.append({'Quantity': quantity, 'Element': element_name})
                            else:
                                print(f"Skipping invalid quantity: {quantity_text}")  # Debug info

                    threshold_info = {
                        'Elements': elements_info
                    }

                    innate_data['Thresholds'].append(threshold_info)

                innates_with_thresholds.append(innate_data)

            return innates_with_thresholds

        except requests.exceptions.ConnectionError as e:
            print(f"Connection error: {e}. Retrying...")
            time.sleep(2)

    return innates_with_thresholds

# Main execution
url = "https://spiritislandwiki.com/index.php?title=List_of_Spirits"
spirits = fetch_spirits(url)

# Save to spirits.json
with open('spirits.json', 'w') as json_file:
    json.dump(spirits, json_file, indent=4)  # Write JSON with pretty printing

print("Spirits data has been saved to spirits.json.")
