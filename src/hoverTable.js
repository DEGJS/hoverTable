let hoverTable = function(element, options) {
        
    let settings,
        tableRowEls,
        hoveredEl,
        hoverTriggerTags,
        hoveredIndex,
        matchingRowEl,
        matchingColEl,
        defaults = {
            headerHoverEnabled: false,
            highlightElement: true,
            highlightRow: true,
            highlightColumn: true,
            noHoverClass: 'no-hover',
            cellClass: 'is-hover-cell',
            rowClass: 'is-hover-row',
            colClass: 'is-hover-col'
        };

    function init() {
        settings = Object.assign({}, defaults, options);
        hoverTriggerTags = settings.headerHoverEnabled ? ['th','td'] : ['td'];
        bindEvents();
    };

    function bindEvents() {
        element.addEventListener('mouseover', onCellMouseover);
        element.addEventListener('mouseout', onCellMouseout);
    };

    function onCellMouseover(e) {
        hoveredEl = getParentByTagName(e.target, hoverTriggerTags);
        if ((hoveredEl !== null) && (!hoveredEl.classList.contains(settings.noHoverClass))) {
            if (settings.highlightElement) {
                hoveredEl.classList.add(settings.cellClass);
            }
            if ((settings.highlightRow) || (settings.highlightColumn)) {
                if (settings.highlightRow) {
                    matchingRowEl = getParentByTagName(hoveredEl, 'tr');
                    matchingRowEl.classList.add(settings.rowClass);
                }
                if (settings.highlightColumn) {
                    let tbodyEl = getParentByTagName(hoveredEl, 'tbody');
                    tableRowEls = tbodyEl.querySelectorAll('tr');
                    hoveredIndex = getElIndex(hoveredEl);
                    for (var i = 0; i < tableRowEls.length; i++) {
                        let rowItemSelectors = settings.headerHoverEnabled ? 'th, td' : 'td',
                            rowItems = Array.prototype.slice.call(tableRowEls[i].querySelectorAll(rowItemSelectors));
                        if (rowItems[hoveredIndex]) {
                            rowItems[hoveredIndex].classList.add(settings.colClass);
                        }
                    }
                }
            }
        }
    };

    function onCellMouseout() {
        if ((hoveredEl) && (settings.highlightElement)) {
            hoveredEl.classList.remove(settings.cellClass);
        }
        if ((matchingRowEl) && (settings.highlightRow)) {
            matchingRowEl.classList.remove(settings.rowClass);
        }
        if (settings.highlightColumn) {
            if (tableRowEls) {
                for (var i = 0; i < tableRowEls.length; i++) {
                    let rowItems = Array.prototype.slice.call(tableRowEls[i].querySelectorAll('th, td'));
                    if (rowItems[hoveredIndex]) {
                        rowItems[hoveredIndex].classList.remove(settings.colClass);
                    }
                }
            }
        }
    };

    function getParentByTagName(el, elNames) {
        while (el && el.parentNode) {
            if (elNames.indexOf(el.tagName.toLowerCase()) !== -1) {
                return el;
            } else {
                el = el.parentNode;
                if ((el.tagName) && (elNames.indexOf(el.tagName.toLowerCase()) !== -1)) {
                    return el;
                }
            }
        }
        return null;
    };

    function getElIndex(el) {
        var index = 0;
        while (el = el.previousSibling) {
            if (el.nodeType != 3 || !/^\s*$/.test(el.data)) {
                index++;
            }
        }
        return index;
    };

    function destroy() {
        onCellMouseout();
        element.removeEventListener('mouseover', onCellMouseover);
        element.removeEventListener('mouseout', onCellMouseout);
    };

    init();

    return {
        destroy: destroy
    }

}

export default hoverTable;