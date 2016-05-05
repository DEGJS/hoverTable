import domUtils from "DEGJS/domUtils";

let linksToSelect = function(element, options) {
        
    let settings,
        linkEls,
        selectEl,
        noElMsg = 'No linksToSelect element set.',
        defaults = {
            linkSelector: 'a',
            linkAttributeSelector: 'href',
            linkActiveClass: 'is-active',
            linksWrapperClass: 'lts-link-wrapper',
            selectClass: 'lts-select',
            destinationEl: null,
            onSelectChangeCallback: null
        };

    function init() {
        if (element) {
            settings = Object.assign({}, defaults, options);
            linkEls = element.querySelectorAll(settings.linkSelector);
            create();
        } else {
            console.log(noElMsg);
        }        
    };

    function create() {
        if(!element.classList.contains(settings.linksWrapperClass)) {
            element.classList.add(settings.linksWrapperClass);
            if (settings.destinationEl !== null) {
                settings.destinationEl.insertAdjacentHTML('afterbegin', renderSelectEl());
                selectEl = settings.destinationEl.querySelector('.' + settings.selectClass);
            } else {
                element.insertAdjacentHTML('afterend', renderSelectEl());
                selectEl = element.nextSibling;
            }
            bindEvents();
        }
    };

    function renderSelectEl() {
        let output = `<select class="${settings.selectClass}">`;
        Array.from(linkEls).forEach(function(linkEl) {
            output += `<option value="${linkEl.getAttribute(settings.linkAttributeSelector)}"${linkEl.classList.contains(settings.linkActiveClass) ? ' selected' : ''}>${linkEl.text}</option>`;
        });
        output += '</select>';
        return output;
    };

    function bindEvents() {
        selectEl.addEventListener('change', onSelectChange);
    };

    function onSelectChange(e) {
        if (settings.onSelectChangeCallback !== null) {
            settings.onSelectChangeCallback();
        } else {
            window.location = e.target.value;
        }
    };

    function destroy() {
        element.classList.remove(settings.linksWrapperClass);
        selectEl.removeEventListener('change', onSelectChange);
        domUtils.removeElements(selectEl);
    };

    init();

    return {
        create: create,
        destroy: destroy
    };

};

export default linksToSelect;