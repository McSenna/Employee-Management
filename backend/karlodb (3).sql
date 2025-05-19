-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 19, 2025 at 02:36 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `karlodb`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `action` varchar(255) NOT NULL,
  `details` text DEFAULT NULL,
  `ip_address` varchar(45) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `details`, `ip_address`, `created_at`) VALUES
(1, 1, 'login', 'Employee logged in', '::1', '2025-05-17 23:05:46'),
(2, 26, 'add_employee', 'New employee added: First Name Last Name', '::1', '2025-05-17 23:15:56'),
(3, 0, 'Admin Created a New User', '{\"name\":\"First Name Last Name\",\"employee_id\":\"IT27175\",\"role\":\"employee\",\"department\":\"IT\",\"email\":\"email@gmail.com\"}', '::1', '2025-05-17 23:15:56'),
(4, 27, 'add_employee', 'New employee added: test user', '::1', '2025-05-17 23:22:08'),
(5, 0, 'Admin Created a New User', 'Array', '::1', '2025-05-17 23:22:09'),
(6, 28, 'add_employee', 'New employee added: ajay espiritu', '::1', '2025-05-17 23:27:16'),
(7, 0, 'Admin created a new user: ajay espiritu', 'Array', '::1', '2025-05-17 23:27:16'),
(8, 29, 'add_employee', 'New employee added: arayko arayko', '::1', '2025-05-17 23:28:54'),
(9, 0, 'Admin Created a New User', '{\"name\":\"arayko arayko\",\"employee_id\":\"IT77192\",\"role\":\"employee\",\"department\":\"IT\",\"email\":\"arayko@gmail.com\"}', '::1', '2025-05-17 23:28:54'),
(10, 0, 'delete_employee', '{\"employee_id\":29,\"employee_name\":\"arayko arayko\",\"admin_id\":null}', '::1', '2025-05-17 23:34:34'),
(11, 0, 'Delete', '{\"employee_id\":27,\"employee_name\":\"test user\",\"admin_id\":null}', '::1', '2025-05-17 23:39:38'),
(12, 0, 'Delete', '{\"employee_id\":13,\"employee_name\":\"test2 user2\",\"admin_id\":null}', '::1', '2025-05-17 23:39:42'),
(13, 0, 'Delete', '{\"employee_id\":26,\"employee_name\":\"First Name Last Name\",\"admin_id\":null}', '::1', '2025-05-17 23:39:52'),
(14, 30, 'Add Employee', 'New employee added: First Name Last Name', '::1', '2025-05-17 23:39:59'),
(15, 31, 'Add Employee', 'New employee added: test test', '::1', '2025-05-17 23:40:51'),
(16, 32, 'Add Employee', 'New employee added: se se', '::1', '2025-05-17 23:41:24'),
(17, 0, 'Delete', '{\"employee_id\":32,\"employee_name\":\"se se\",\"admin_id\":null}', '::1', '2025-05-17 23:44:49'),
(18, 33, 'Add Employee', 'New employee added: se se', '::1', '2025-05-17 23:44:56'),
(19, 34, 'Add Employee', 'New employee added: lusi lusi', '::1', '2025-05-17 23:51:43'),
(20, 0, 'Delete', '{\"employee_id\":34,\"employee_name\":\"lusi lusi\",\"admin_id\":null}', '::1', '2025-05-17 23:53:45'),
(21, 35, 'Add Employee', 'New employee added: lusi lusi', '::1', '2025-05-17 23:53:53'),
(22, 0, 'Admin Failed to Create a New User', '{\"attempted_user\":\"arayko1 arayko\",\"attempted_email\":\"arayko2@gmail.com\",\"error\":\"No valid data received. Please submit form data or JSON.\"}', '::1', '2025-05-17 23:58:14'),
(23, 0, 'Admin Failed to Create a New User', '{\"attempted_user\":\"arayko1 arayko\",\"attempted_email\":\"arayko2@gmail.com\",\"error\":\"No valid data received. Please submit form data or JSON.\"}', '::1', '2025-05-18 00:02:05'),
(24, 0, 'Admin Created a New User', '{\"name\":\"arayko1 arayko\",\"employee_id\":\"MAR97720\",\"role\":\"employee\",\"department\":\"Marketing\",\"email\":\"arayko2@gmail.com\"}', '::1', '2025-05-18 00:02:24'),
(25, 0, 'Admin Created a New User', '{\"name\":\"arayko3 arayko\",\"employee_id\":\"FIN69767\",\"role\":\"employee\",\"department\":\"Finance\",\"email\":\"arayko5@gmail.com\"}', '::1', '2025-05-18 00:08:46'),
(26, 0, 'Admin Failed to Create a New User', '{\"attempted_user\":\"arayko3 arayko\",\"attempted_email\":\"arayko5@gmail.com\",\"error\":\"No valid data received. Please submit form data or JSON.\"}', '::1', '2025-05-18 00:09:40'),
(27, 0, 'Admin Failed to Create a New User', '{\"attempted_user\":\"arayko3 arayko\",\"attempted_email\":\"arayko5@gmail.com\",\"error\":\"No valid data received. Please submit form data or JSON.\"}', '::1', '2025-05-18 00:09:46'),
(28, 36, 'Add Employee', 'New employee added: arayko3 arayko', '::1', '2025-05-18 00:10:48'),
(29, 0, 'Admin Created a New User', '{\"name\":\"arayko3 arayko\",\"employee_id\":\"IT21644\",\"role\":\"employee\",\"department\":\"IT\",\"email\":\"arayko5@gmail.com\"}', '::1', '2025-05-18 00:10:48'),
(30, 0, 'Delete', '{\"employee_id\":36,\"employee_name\":\"arayko3 arayko\",\"admin_id\":null}', '::1', '2025-05-18 00:11:07'),
(31, 0, 'Admin Failed to Create a New User', '{\"attempted_user\":\"arayko3 arayko\",\"attempted_email\":\"arayko5@gmail.com\",\"error\":\"No valid data received. Please submit form data or JSON.\"}', '::1', '2025-05-18 00:11:18'),
(32, 37, 'Add Employee', 'New employee added: arayko3 arayko', '::1', '2025-05-18 00:11:40'),
(33, 0, 'Admin Created a New User', '{\"name\":\"arayko3 arayko\",\"employee_id\":\"FIN10946\",\"role\":\"employee\",\"department\":\"Finance\",\"email\":\"arayko2@gmail.com\"}', '::1', '2025-05-18 00:11:40'),
(34, 38, 'Add Employee', 'New employee added: eme eme', '::1', '2025-05-18 00:15:57'),
(35, 0, 'Admin Created a New Employee', '{\"name\":\"eme eme\",\"employee_id\":\"IT82972\",\"role\":\"employee\",\"department\":\"IT\",\"email\":\"eme@gmail.com\"}', '::1', '2025-05-18 00:15:57'),
(36, 39, 'Add Employee', 'New employee added: eme1 eme1', '::1', '2025-05-18 00:17:34'),
(37, 0, 'Admin Created a New User', '{\"name\":\"eme1 eme1\",\"employee_id\":\"IT72375\",\"role\":\"employee\",\"department\":\"IT\",\"email\":\"eme1@gmail.com\"}', '::1', '2025-05-18 00:17:34'),
(38, 40, 'add_employee', 'New employee added: eme3 eme3', '::1', '2025-05-18 00:19:18'),
(39, 0, 'Admin Created a New User', NULL, '::1', '2025-05-18 00:19:18'),
(40, 0, 'Delete', '{\"employee_id\":39,\"employee_name\":\"eme1 eme1\",\"admin_id\":null}', '::1', '2025-05-18 00:23:30'),
(41, 0, 'Delete', '{\"employee_id\":40,\"employee_name\":\"eme3 eme3\",\"admin_id\":null}', '::1', '2025-05-18 00:23:37'),
(42, 41, 'add_employee', 'New employee added: eme3 eme3', '::1', '2025-05-18 00:23:50'),
(43, 0, 'Admin Created a New User', NULL, '::1', '2025-05-18 00:23:50'),
(44, 42, 'add_employee', 'New employee added: tesfd test1', '::1', '2025-05-18 00:28:24'),
(45, 0, 'Admin Created a New User', NULL, '::1', '2025-05-18 00:28:24'),
(46, 43, 'add_employee', 'New employee added: tesfd1 test11', '::1', '2025-05-18 00:31:44'),
(47, 0, 'Admin Created a New User', NULL, '::1', '2025-05-18 00:31:44'),
(48, 0, 'Delete', '{\"employee_id\":43,\"employee_name\":\"tesfd1 test11\",\"admin_id\":null}', '::1', '2025-05-18 00:32:45'),
(49, 0, 'Delete', '{\"employee_id\":42,\"employee_name\":\"tesfd test1\",\"admin_id\":null}', '::1', '2025-05-18 00:34:23'),
(50, 0, 'Delete', '{\"employee_id\":41,\"employee_name\":\"eme3 eme3\",\"admin_id\":null}', '::1', '2025-05-18 00:34:27'),
(51, 0, 'Delete', '{\"employee_id\":38,\"employee_name\":\"eme eme\",\"admin_id\":null}', '::1', '2025-05-18 00:34:30'),
(52, 0, 'Delete', '{\"employee_id\":37,\"employee_name\":\"arayko3 arayko\",\"admin_id\":null}', '::1', '2025-05-18 00:34:33'),
(53, 0, 'Delete', '{\"employee_id\":35,\"employee_name\":\"lusi lusi\",\"admin_id\":null}', '::1', '2025-05-18 00:34:38'),
(54, 0, 'Admin Failed to Create a New User', NULL, '::1', '2025-05-18 00:37:28'),
(55, 0, 'Admin Delete A Employee', '{\"employee_id\":33,\"employee_name\":\"se se\",\"admin_id\":null}', '::1', '2025-05-18 00:41:45'),
(56, 44, 'add_employee', 'New employee added: se se', '::1', '2025-05-18 00:42:16'),
(57, 0, 'Admin Created a New User', NULL, '::1', '2025-05-18 00:42:16'),
(58, 0, 'Admin Delete A Employee', '{\"employee_id\":44,\"employee_name\":\"se se\",\"admin_id\":null}', '::1', '2025-05-18 00:43:13'),
(59, 0, 'Admin Delete A Employee', '{\"employee_id\":31,\"employee_name\":\"test test\",\"admin_id\":null}', '::1', '2025-05-18 00:43:16'),
(60, 0, 'Admin Created a New User', NULL, '::1', '2025-05-18 00:47:30'),
(61, 0, 'Admin Created a New User', NULL, '::1', '2025-05-18 00:48:25'),
(62, 45, 'add_employee', 'New employee added: Noel Abordo', '::1', '2025-05-18 00:49:37'),
(63, 0, 'Admin Created a New User', NULL, '::1', '2025-05-18 00:49:37'),
(64, 45, 'login', 'Employee logged in', '::1', '2025-05-18 03:21:46'),
(65, 45, 'login', 'Employee logged in', '::1', '2025-05-18 03:22:52'),
(66, 45, 'login', 'Employee logged in', '::1', '2025-05-18 03:39:35'),
(67, 1, 'login', 'Employee logged in', '::1', '2025-05-18 03:41:03'),
(68, 46, 'add_employee', 'New employee added: Airah Mae Vibar', '::1', '2025-05-18 03:47:48'),
(69, 0, 'Admin Created a New User', NULL, '::1', '2025-05-18 03:47:48'),
(70, 46, 'login', 'Employee logged in', '::1', '2025-05-18 03:48:04'),
(71, 46, 'login', 'Employee logged in', '::1', '2025-05-18 03:51:34'),
(72, 1, 'login', 'Employee logged in', '::1', '2025-05-19 00:14:21'),
(73, 46, 'login', 'Employee logged in', '::1', '2025-05-19 00:16:43'),
(74, 45, 'login', 'Employee logged in', '::1', '2025-05-19 00:18:29');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `employee_id` varchar(20) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `department` varchar(50) NOT NULL,
  `job_title` varchar(50) NOT NULL,
  `role` enum('admin','hr','employee') NOT NULL DEFAULT 'employee',
  `profile_picture` varchar(255) DEFAULT NULL,
  `hire_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `age` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `employee_id`, `first_name`, `last_name`, `email`, `password`, `department`, `job_title`, `role`, `profile_picture`, `hire_date`, `created_at`, `updated_at`, `age`) VALUES
(1, 'ADMIN001', 'System', 'Administrator', 'admin@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administration', 'System Admin', 'admin', NULL, '2025-05-13', '2025-05-12 16:02:53', '2025-05-19 00:14:21', 0),
(3, 'IT29152', 'Noriel', 'Malate', 'nori@gmail.com', '$2y$10$IemKO.B4ppHhCu70JVxXVOjSpE3xldPAeabp3sCjezbSmzDChfri.', 'IT', 'Sys Ad', 'employee', NULL, '2025-05-14', '2025-05-12 17:24:40', '2025-05-17 14:58:24', 20),
(45, 'FIN75063', 'Noel', 'Abordo', 'noel@gmail.com', '$2y$10$D77Zm5KMJSLRmUUf3CJ1lu84mwjoAo2ohogjmoO4FclyN.ti7UDWG', 'Finance', 'Tambay', 'employee', 'uploads/profile_pictures/FIN75063_1747529377_bonel.jpg', '2025-05-18', '2025-05-18 00:49:37', '2025-05-19 00:18:29', 21),
(46, 'IT27049', 'Airah Mae', 'Vibar', 'airah@gmail.com', '$2y$10$4rvIsGO1rhDf64INNjQptuDIPEwsJpAHwDPClHOvthFArYR/UEA8m', 'IT', 'Full Stack Developer', 'hr', 'uploads/profile_pictures/IT27049_1747540068_airah.jpg', '2025-05-18', '2025-05-18 03:47:48', '2025-05-19 00:16:43', 21);

-- --------------------------------------------------------

--
-- Table structure for table `employee_files`
--

CREATE TABLE `employee_files` (
  `id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_type` enum('resume','contract','certificate','other') NOT NULL,
  `description` text DEFAULT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `size` int(11) NOT NULL COMMENT 'File size in bytes',
  `mime_type` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_files`
--

INSERT INTO `employee_files` (`id`, `employee_id`, `file_name`, `file_path`, `file_type`, `description`, `uploaded_at`, `size`, `mime_type`) VALUES
(2, 3, 'PRELIM PROJECT.pdf', 'uploads/employees/3/6824e0dfa6e5c_PRELIM PROJECT.pdf', 'contract', 'No Worries', '2025-05-14 18:28:47', 193660, 'application/pdf'),
(20, 45, 'PRELIM PROJECT.pdf', 'uploads/employees/45/682a7b727169e_PRELIM PROJECT.pdf', 'other', 'asdasdada', '2025-05-19 00:29:38', 193660, 'application/pdf');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `employee_id` (`employee_id`);

--
-- Indexes for table `employee_files`
--
ALTER TABLE `employee_files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `employee_files`
--
ALTER TABLE `employee_files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `employee_files`
--
ALTER TABLE `employee_files`
  ADD CONSTRAINT `employee_files_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
