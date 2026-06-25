from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.route("**/api/settings/*", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body='{"id":"PROFESSIONAL_VAPE","storeName":"Professional Vape","logoUrl":"http://localhost:8080/uploads/7c00878a-bebb-4888-99a1-d436398b930a.jpeg","address":"Via Roma 1","instagram":"","facebook":"","tiktok":"","whatsapp":""}'
    ))

    page.goto("http://localhost:5173/PROFESSIONAL_VAPE")
    page.wait_for_timeout(3000)

    # Open the Info & Social dropdown
    page.get_by_role("button", name="Info & Social").click()
    page.wait_for_timeout(1000)
    page.screenshot(path="/tmp/dropdown_address_link.png")

    # Verify the href attribute of the address link
    address_link = page.locator("a:has-text('Via Roma 1')")
    if address_link.count() > 0:
        href = address_link.get_attribute("href")
        print(f"Address href: {href}")
    else:
        print("Address link not found")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
