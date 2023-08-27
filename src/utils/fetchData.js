import axios from "axios";
import { HEADER_FOOTER_ENDPOINT } from '../utils/constants/endpoints';


export async function fetchCommonData() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/custom/v1/next/`,{
            next: {revalidate: 10}
        });
        const data = await response.json();
        return data || {};
    } catch (error) {
        console.error("Error fetching common data:", error);
        return {};
    }
}

