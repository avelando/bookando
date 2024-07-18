import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import styles from "../styles/Header.module.css";

const Header: React.FC = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleLogout = () => {
        signOut({ callbackUrl: "/" });
    };

    return (
        <header className={styles.header}>
            <Image className={styles.logo} src="/images/img.png" alt="Bookando logo" width={30} height={30} />

            <nav>
                <ul className={styles.navList}>
                <li className={styles.navItem}>
                    <Link href="/">Home</Link>
                </li>
                <li className={styles.navItem}>
                    <Link href="/books">Books</Link>
                </li>
                <li className={styles.navItem}>
                    <Link href="/about">About</Link>
                </li>
                </ul>
            </nav>

            <div className={styles.profileMenu}>
                <Image
                    className={styles.person}
                    src="/images/person.ico"
                    alt="person"
                    width={30}
                    height={30}
                    onClick={toggleDropdown}
                />
                {dropdownOpen && (
                    <div className={styles.dropdown}>
                        <div className={styles.profile}>
                            <Link href="/profile">
                                {/* <Image className={styles.image} src="/images/logout.png" alt="Person" width={20} height={20} /> */}
                                Profile
                            </Link>
                        </div>
            
                        <div className={styles.logout}>
                            <a onClick={handleLogout}>
                                <Image className={styles.image} src='/images/logout.png' alt="Logout" width={20} height={20} />
                                Logout
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
