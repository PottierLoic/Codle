import csv
import os
from dotenv import load_dotenv
from supabase import create_client, Client
load_dotenv('.env.local')
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
TABLE_NAME = 'snippet'  
CSV_FILE = 'snippets.csv'  
def insert_data_from_csv():
    with open(CSV_FILE, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        data_to_insert = []
        for row in reader:
            code_with_formatting = row['code'].replace('\\n', '\n').replace('\\t', '\t')
            entry = {
                'id': int(row['id']),
                'language_id': int(row['language_id']),
                'code': code_with_formatting,  
                'description': row['description'],
                'link': row['link']
            }
            data_to_insert.append(entry)
        try:
            response = supabase.table(TABLE_NAME).insert(data_to_insert).execute()
            print(f"Successfully inserted {len(response.data)} rows into {TABLE_NAME}")
        except Exception as e:
            print(f"Error inserting data: {str(e)}")
if __name__ == "__main__":
    insert_data_from_csv()