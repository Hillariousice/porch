# Fitness+ Backend API

## Overview

This project implements a backend system for Fitness+, a gym that offers various memberships with different billing structures. The system manages gym memberships, generates invoices, and sends email reminders for upcoming payments.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies](#technologies)
- [Setup and Installation](#setup-and-installation)
- [Data Model](#data-model)
- [Cron Job Implementation](#cron-job-implementation)
- [Email Functionality](#email-functionality)
- [Error Handling](#error-handling)
- [Scalability](#scalability)
- [Testing](#testing)
- [Assumptions](#assumptions)

## Features

1. **Membership Management**: Store and manage gym membership details.
2. **Invoice Generation**: Generate invoices for annual memberships and monthly add-on services.
3. **Email Reminders**: Send email reminders for upcoming payments.
4. **Cron Job**: Periodic cron job to check for upcoming membership fees and send reminders.

## Technologies

- **NestJS**: Framework for building scalable server-side applications.
- **PostgreSQL**: Relational database to store membership data.
- **TypeORM**: ORM for database interaction.
- **Gmail SMTP**: Email service for sending reminders.
- **Node-cron**: Scheduling library for cron jobs.

## Setup and Installation

### Prerequisites

- Node.js and npm
- PostgreSQL

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/fitness-plus-backend.git
   cd fitness-plus-backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the root directory and add the following variables:
   ```plaintext
   DATABASE_URL=postgres://user:password@localhost:5432/fitnessplus
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-email-password
   ```

4. **Run database migrations**:
   ```bash
   npm run typeorm migration:run
   ```

5. **Start the application**:
   ```bash
   npm run start
   ```

## Data Model

The data model includes the following entities:

- **Membership**:
  - `memberId`: UUID
  - `firstName`: string
  - `lastName`: string
  - `membershipType`: string (Annual Basic, Monthly Premium, etc.)
  - `startDate`: Date
  - `dueDate`: Date
  - `monthlyDueDate`: Date
  - `totalAmount`: number
  - `email`: string
  - `isFirstMonth`: boolean
  - `status`: string (Active, Inactive, Pending)
  - `createdAt`: Date

## Cron Job Implementation

A cron job runs daily to check for upcoming membership fees:

1. **Query the database for upcoming due dates**.
2. **Differentiate between annual memberships and add-on services**:
   - For new members (first month):
     - Calculate the reminder date (7 days before the due date).
     - Send an email reminder with the combined annual fee and first month's add-on service charges.
   - For existing members (subsequent months):
     - Check if the current date falls within the month for the add-on service.
     - Send an email reminder for the add-on service charge.

## Email Functionality

Emails are sent using the Gmail SMTP server:

- **Subject**: Fitness+ Membership Reminder - [Membership Type]
- **Body**: Reminder message with membership details and a link to the invoice.

## Error Handling

- **Database connection issues**: Handled gracefully with appropriate logging.
- **Email delivery failures**: Logged and retried as needed.

## Scalability

- **Database**: PostgreSQL can handle large amounts of data and supports scaling.
- **Application**: NestJS framework supports microservices and can be scaled horizontally.

## Testing

- **Unit Tests**: Included for key functionalities.
- **Integration Tests**: Test the interaction between different parts of the system.

### Running Tests

```bash
npm run test
```

## Assumptions

- **Data Format**: Membership data is consistent with the provided schema.
- **Email Delivery**: Gmail SMTP server is used for sending emails.
- **Invoice Management**: Links to detailed invoices are assumed to be generated and stored externally.

