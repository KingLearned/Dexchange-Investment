-- phpMyAdmin SQL Dump
-- version 5.1.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 05, 2023 at 09:09 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 7.4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dexchange`
--

-- --------------------------------------------------------

--
-- Table structure for table `manager`
--

CREATE TABLE `manager` (
  `req_id` int(255) NOT NULL,
  `client_name` varchar(255) NOT NULL,
  `balance` float NOT NULL,
  `amount` float NOT NULL,
  `date` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `manager`
--

INSERT INTO `manager` (`req_id`, `client_name`, `balance`, `amount`, `date`) VALUES
(86, 'Learned', 3417.62, 10, '16-12-2022|16:13:13'),
(97, 'Wisdom', 1478.09, 15, '16-12-2022|18:53:53'),
(102, 'Solomon', 4248.35, 150, '16-12-2022|19:06:06'),
(112, 'nelson', 9735.45, 50, '17-12-2022|21:38:38');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `user_pwd` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `setup_status` varchar(255) NOT NULL,
  `ref_key` varchar(255) NOT NULL,
  `total_ref` int(255) NOT NULL,
  `active_ref` int(255) NOT NULL,
  `ref_status` varchar(255) NOT NULL,
  `ref_comm` int(255) NOT NULL,
  `upline` varchar(255) NOT NULL,
  `wallet_no` varchar(255) NOT NULL,
  `balance` varchar(255) NOT NULL,
  `total_depo` int(255) NOT NULL,
  `last_depo` int(255) NOT NULL,
  `total_withdraw` int(255) NOT NULL,
  `last_withdraw` int(255) NOT NULL,
  `pend_withdraw` int(255) NOT NULL,
  `date` varchar(255) NOT NULL,
  `current_earn` varchar(255) NOT NULL,
  `total_earn` varchar(255) NOT NULL,
  `pwd_reseter` varchar(255) NOT NULL,
  `coupon` varchar(255) NOT NULL,
  `last_date` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `user_pwd`, `email`, `setup_status`, `ref_key`, `total_ref`, `active_ref`, `ref_status`, `ref_comm`, `upline`, `wallet_no`, `balance`, `total_depo`, `last_depo`, `total_withdraw`, `last_withdraw`, `pend_withdraw`, `date`, `current_earn`, `total_earn`, `pwd_reseter`, `coupon`, `last_date`) VALUES
(1, 'Nelson', '12345', 'chithomzzy@gmail.com', 'Done', 'Ref-Key-Nelson2679', 3, 3, 'Active', 3865, 'None', 'bt1qqrechgh4mb58zunff7cvahywdwrysjdbfg8th', '12935.449999999997', 25986, 500, 26013, 50, 50, '17-12-2022', '100.00000000000007', '9097.199999999999', '994027328', 'D$vh%_njtg969937380stu$ebf%d', 'Fri Dec 16 2022 14:08:27'),
(2, 'Wisdom', '12345', 'Wisdom@hotmail.org', 'Done', 'Ref-Key-Wisdom2448', 0, 0, 'Active', 0, 'Ref-Key-Nelson2679', 'bt1qqrechgh4mb58zunff7cvahywdwrysjdbfg8th', '1478.0899999999988', 5503, 53, 5116, 10, 15, '16-12-2022', '10.246666666666659', '1089.999999999999', '', 'D$vh%_njtg1072636632stu$ebf%d', ''),
(3, 'Learned', '12345', 'Learbed@gmail.com', 'Done', 'Ref-Key-Learned2352', 0, 0, 'Active', 0, 'Ref-Key-Nelson2679', 'bt1qqrechk3v3kyf8zunff7cvahywdwrysuf4lwvts', '3417.6200000000003', 5217, 4587, 1926, 50, 10, '16-12-2022', '917.3999999999993', '125.99999999999986', '', 'D$vh%_njtg931900620stu$ebf%d', ''),
(4, 'Solomon', '12345', 'solo@mail.com', 'Done', 'Ref-Key-Solomon2025', 0, 0, 'Active', 0, 'None', 'bt1qqrechk3v3kyf8zunff7cvahywdwrysuf4lwvts', '4248.35', 6000, 6000, 1752, 560, 150, '16-12-2022', '2700', '0', '', 'D$vh%_njtg1072636632stu$ebf%d', ''),
(5, 'ugyneforever', '12345', 'ugyne50@gmail.com', 'Done', 'Ref-Key-ugyneforever2499', 0, 0, 'Active', 0, 'None', 'bt1qqrechk3v3kyf8zunff7cvahywdwrysuf4lwvts', '5235.36', 5489, 5489, 254, 254, 0, '', '1097.799999999999', '0', '', 'D$vh%_njtg893863860stu$ebf%d', ''),
(6, 'King', '12345', 'King@gmail.com', 'Done', 'Ref-Key-King2208', 0, 0, 'Active', 0, 'None', 'bt1qqrechk3v3kyf8zunff7cvahyw54&dwrysuf4lw', '6007.450000000001', 6853, 6853, 846, 150, 0, '16-12-2022', '3083.8500000000017', '0', '', 'D$vh%_njtg973741056stu$ebf%d', ''),
(7, 'winner', '12345', 'winner@gmail.com', 'Done', 'Ref-Key-winner2622', 0, 0, 'Active', 0, 'Ref-Key-Nelson2679', 'bt1qqrechgh4mb58zunff7cvahywdwrysjdbfg8th', '65943', 66560, 66000, 729, 150, 0, '16-12-2022', '0', '111.99999999999984', '', 'D$vh%_njtg855827100stu$ebf%d', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `manager`
--
ALTER TABLE `manager`
  ADD PRIMARY KEY (`req_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `manager`
--
ALTER TABLE `manager`
  MODIFY `req_id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=113;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
