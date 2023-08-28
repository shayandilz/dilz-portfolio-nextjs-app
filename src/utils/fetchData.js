import axios from "axios";
import { HEADER_FOOTER_ENDPOINT } from '../utils/constants/endpoints';


export async function fetchCommonData() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/custom/v1/next/`);
        const data = await response.json();
        return data || {};
    } catch (error) {
        console.error("Error fetching common data:", error);
        return {};
    }
}

export async function fetchPostData(page = 1, perPage = 10) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/custom-blog/v1/posts?page=${page}&per_page=${perPage}`);
        const data = await response.json();
        return data || {};
    } catch (error) {
        console.error("Error fetching common data:", error);
        return {};
    }
}
