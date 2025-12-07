# Greenwood Medical Clinic

## Appointment & Patient Management Prototype

CPSC 481 – Interaction Design Portfolio II (Fall 2025)

---

## 🔗 Live Demo

[https://greenwood-medical-center-qfrw.vercel.app/](https://greenwood-medical-center-qfrw.vercel.app/)

*Best viewed at: 1800 × 1100*

## 🔐 Login Credentials

- **Email:** [selena@gmcclinic.com](mailto:selena@gmcclinic.com)
- **Password:** password123

---

This repository contains a high-fidelity prototype of Greenwood Medical Clinic’s internal workflow system for front-desk staff.
It is built using **plain HTML, CSS, and JavaScript**, and deployed on **Vercel**, with data stored in simulated in-memory structures.

The prototype demonstrates a complete day in the life of a receptionist — including adding patients, booking appointments, rescheduling, cancellations, check-ins, follow-ups, and billing.

---

## 1. Overview

Greenwood Medical Clinic requires a reliable, intuitive system that minimizes errors while supporting fast-paced administrative work. This prototype was designed to:

- Streamline **patient lookup, registration, and appointment booking**
- Provide strong **visibility of system status**, preventing confusion or errors
- Support real clinic workflows via **shortcuts, consistent UI patterns, and persistent state**
- Reduce cognitive load so staff can complete tasks quickly and confidently

Our focus was not on backend development but on creating a **functional, realistic front-end experience** tailored to real-world needs.

---

## 2. System Walkthrough (Demo Flow)

This walkthrough matches the recommended flow for marking. It highlights features that may otherwise be missed.

### **1. Login**

Selena logs in and lands on a dashboard showing:

- Today’s appointments
- Doctors available
- Quick access to patient records and schedules

### **2. Adding a new patient**

A new caller wishes to book an appointment.
Selena navigates to **Add Patient**, enters the AHS number, and the system **autofills their information** - reducing manual entry errors.

### **3. Booking an appointment for Janet**

- Selena searches for Janet from the patient list
- Opens **Book Appointment**
- Selects the doctor
- Chooses an available time slot (doctor availability rules are enforced)
- Confirms the appointment, which appears **immediately** on the doctor’s schedule

### **4. Another patient, Chloe, calls**

Selena uses the **Book Appointment Shortcut** on the dashboard, demonstrating workflow efficiency.

### **5. Rescheduling Chloe’s appointment**

- Opening the appointment modal shows all details
- Selena clicks **Reschedule**
- A **persistent rescheduling banner** stays visible even after closing the modal, preventing context loss
- The system **blocks unavailable times** and shows clear error messages

### **6. Cancelling the appointment**

- Selena cancels the appointment
- Cancellation behaves the same from both the patient and doctor views, ensuring consistency
- The dashboard updates immediately

### **7. Patient check-in and appointment completion**

Later, a patient arrives:

- Selena checks them in
- After the appointment, Selena marks it as **Completed**
- The system now enables **Follow-Up**, while preventing accidental edits to completed fields

### **8. End-of-day billing**

Selena processes billing based on the day’s appointments.
The front-end billing module:

- Shows billable appointments
- Allows marking entries as paid
- Keeps billing and appointment states consistent

This demo covers the entire lifecycle of a clinic visit - from first contact to billing.

---

## 3. Features Implemented

### Login & Session

- Basic credential system
- Error handling for incorrect inputs

### Patient Management

- Add new patients manually (AHS auto-fill is a planned feature and is not implemented in this prototype)
- Comprehensive patient profiles
- Search by **name, AHS number, phone, or ID**

### Appointment Booking

- Complete weekly doctor schedule
- Logical time blocking (no double-booking or off-hours booking)
- Booking modal includes:

  - Doctor & patient selector
  - Selected time
  - Full confirmation summary

### Rescheduling

- Persistent “rescheduling mode” indicator
- Appointment details retain previous inputs
- Errors shown when choosing invalid time slots

### Cancellation

- Unified behavior across patient and doctor views
- Clear confirmation modal
- Immediate UI update

### Check-In, Completion, Follow-Up

- Real-time status updates
- Completed appointments lock previous fields
- Follow-up action becomes available after completion

### Billing (Front-End Simulation)

- View all appointments requiring payment
- Mark items as paid
- Billing and appointment statuses remain synchronized

### Visual & UX Feedback

- Toast notifications
- Error and success states
- Confirmation dialogs
- Preventive design (e.g., inactive time slots, disabled buttons)

---

## 4. Tech Stack & Setup

### **Tech Stack**

- **HTML5**
- **CSS3**
- **JavaScript (Vanilla)**
- No backend — uses JS in-memory structures
- Deployed on **Vercel**

### **Running the Prototype**

No installation needed.

1. Open the Vercel link
2. Log in using the provided credentials
3. Use a desktop/laptop browser for best results

---

## 5. Team

- **Hamna Asad** – Login Design & System Entry
- **Grace Ilori** – Dashboard & Schedule Interaction
- **Ali Khan** – Add Patient + AHS Lookup + Booking Flow
- **Mohammad Moustaqim** – Reschedule, Cancel, Check-In, Follow-Up
- **Neel Savani** – Billing System
