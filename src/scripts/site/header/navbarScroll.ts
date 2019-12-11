function scrollInto(sectionId: string, event: Event) {
    console.log(event);
    const section = document.querySelector<HTMLElement>(sectionId);
    const position = section.getBoundingClientRect();

    if (position.height > window.innerHeight) {
        section.scrollIntoView({
            behavior: "smooth"
        });
    } else {
        const middlePositionOfSection = position.top + (position.height / 2);

        window.scroll({
            top: middlePositionOfSection - (window.innerHeight / 2),
            behavior: "smooth"
        });
    }

    event.preventDefault();
}

function attachClickEvents() {
    const navItems = document.querySelectorAll<HTMLLIElement>(".page-navigation .items .item a");

    for (const item of navItems) {
        const sectionId = item.getAttribute("href");
        item.addEventListener("click", scrollInto.bind(this, sectionId));
    }
}

export function initNavbarScroll() {
    attachClickEvents();
}
