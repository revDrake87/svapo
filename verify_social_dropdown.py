from playwright.sync_api import sync_playwright

def run_cuj(page):
    # Instead of updating the DB, let's just intercept the API call and mock the response
    page.route("**/api/settings/prof", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body='{"id":"prof","storeName":"Professional Vape","logoUrl":null,"address":"Via Roma 1","instagram":"https://instagram.com/prof","facebook":null,"tiktok":null,"whatsapp":null}'
    ))

    page.route("**/api/settings/puff", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body='{"id":"puff","storeName":"Puff Store","logoUrl":null,"address":"Via Milano 2","instagram":null,"facebook":null,"tiktok":null,"whatsapp":"1234567890"}'
    ))

    # Professional Vape (Theme NOT fixed, should respect light/dark mode)
    page.goto("http://localhost:5173/prof")
    page.wait_for_timeout(2000)

    # Click Info & Social to open the dropdown
    page.get_by_role("button", name="Info & Social").click()
    page.wait_for_timeout(1000)

    # Take screenshot of light mode dropdown
    page.screenshot(path="/tmp/prof_light_dropdown.png")

    # The icon toggles between moon/sun depending on current theme. If it's already dark mode, moon won't be there.
    # Just click the button containing either.
    page.locator("button:has(svg.lucide-moon), button:has(svg.lucide-sun)").click()
    page.wait_for_timeout(1000)

    # Click Info & Social again (might have closed on re-render, though state should persist)
    try:
        page.get_by_role("button", name="Info & Social").click()
        page.wait_for_timeout(1000)
    except:
        pass

    # Take screenshot of dark mode dropdown
    page.screenshot(path="/tmp/prof_dark_dropdown.png")

    # Puff Store (Theme FIXED, should always show #00D6EA header styles)
    page.goto("http://localhost:5173/puff")
    page.wait_for_timeout(2000)

    # Click Info & Social to open the dropdown
    page.get_by_role("button", name="Info & Social").click()
    page.wait_for_timeout(1000)

    # Take screenshot of Puff Store dropdown
    page.screenshot(path="/tmp/puff_dropdown.png")


if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/tmp/videos",
            viewport={"width": 400, "height": 800} # Test on mobile viewport
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
