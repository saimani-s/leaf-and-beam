import http.server
import socketserver
import json
import csv
import os

PORT = 8081

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def send_error(self, code, message=None, explain=None):
        if code == 404:
            try:
                with open('404.html', 'rb') as f:
                    content = f.read()
                self.send_response(404)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                self.send_header('Content-Length', str(len(content)))
                self.end_headers()
                self.wfile.write(content)
            except IOError:
                super().send_error(code, message, explain)
        else:
            super().send_error(code, message, explain)

    def do_POST(self):
        if self.path == '/submit':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length).decode('utf-8')
            
            try:
                data = json.loads(post_data)
            except json.JSONDecodeError:
                self.send_response(400)
                self.end_headers()
                return
                
            name = data.get('name', '')
            phone = data.get('phone', '')
            location = data.get('location', '')
            projectType = data.get('projectType', '')
            message = data.get('message', '').strip()
            if not message:
                message = 'NULL'
            
            # Save to Excel-compatible CSV file
            # utf-8-sig encoding ensures Excel opens it correctly with special characters
            csv_file = 'Client_Leads.csv'
            file_exists = os.path.isfile(csv_file)
            
            with open(csv_file, 'a', newline='', encoding='utf-8-sig') as f:
                writer = csv.writer(f)
                if not file_exists:
                    writer.writerow(['Name', 'Phone', 'Location', 'Project Type', 'Message'])
                writer.writerow([name, phone, location, projectType, message])
                
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'success', 'message': 'Saved to Excel successfully'}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == '__main__':
    with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
        print(f"Server with Excel integration running at http://localhost:{PORT}")
        httpd.serve_forever()
