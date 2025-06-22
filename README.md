# CyberGuardian - Cybersecurity Platform

A comprehensive cybersecurity platform featuring interactive security tools, threat management, analytics, and educational resources.

## Features

### Dashboard
- Real-time security metrics and statistics
- Interactive threat monitoring
- Security score tracking
- Quick action buttons for common security tasks

### Security Tools
- **Password Strength Checker**: Analyze password strength with detailed recommendations
- **Vulnerability Scanner**: Comprehensive security assessments with detailed reports
- **Network Monitoring**: Real-time network activity monitoring
- **Incident Response**: Track and manage security incidents

### Threat Management
- Complete threat database with severity levels
- Add, edit, and delete threat entries
- Advanced filtering by category and severity
- Mitigation strategy documentation
- Related threat linking

### Analytics Dashboard
- Interactive charts showing security trends over time
- Threat severity distribution analysis
- Incident resolution metrics
- Category-based threat breakdown
- Comprehensive security reporting

### Cybersecurity Glossary
- Searchable database of security terms
- Category-based organization
- Related terms linking
- Educational definitions and explanations

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Express.js, Node.js, TypeScript
- **Charts**: Recharts for data visualization
- **Storage**: In-memory storage with realistic cybersecurity data
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form with Zod validation

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Backend will run on http://localhost:3000
# Frontend will run on http://localhost:5173
```

## API Endpoints

### Threats
- `GET /api/threats` - Get all threats
- `POST /api/threats` - Create new threat
- `GET /api/threats/:id` - Get specific threat
- `PUT /api/threats/:id` - Update threat
- `DELETE /api/threats/:id` - Delete threat

### Tools
- `GET /api/tools` - Get all security tools
- `POST /api/tools/password-check` - Check password strength
- `POST /api/tools/vulnerability-scan` - Run vulnerability scan

### Glossary
- `GET /api/glossary` - Get all glossary terms
- `POST /api/glossary` - Add new term
- `GET /api/glossary/:id` - Get specific term

### Analytics
- `GET /api/analytics` - Get analytics data

## Environment Variables

```env
NODE_ENV=development
PORT=3000
```

## Security Features

- Input validation with Zod schemas
- CORS protection
- Type-safe APIs with TypeScript
- Secure password strength analysis
- Comprehensive vulnerability reporting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support and questions, please open an issue in the repository.