function openTab(evt, tabId) {
    const contents = document.getElementsByClassName("tab-content");
    for (let content of contents) content.classList.remove("active");

    const btns = document.getElementsByClassName("tab-btn");
    for (let btn of btns) btn.classList.remove("active");

    document.getElementById(tabId).classList.add("active");
    evt.currentTarget.classList.add("active");
}
