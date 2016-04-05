let hoverTable = function(element, options) {
        
    let settings,
        tableRowEls,
        hoveredEl,
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
        
        bindEvents();
    };

    function bindEvents() {
        element.addEventListener('mouseover', onCellMouseover);
        element.addEventListener('mouseout', onCellMouseout);
    };

    function onCellMouseover(e) {
        hoveredEl = e.target;
        let tagName = hoveredEl.tagName.toLowerCase(),
            hoverEls = settings.headerHoverEnabled ? ['a','th','td'] : ['a','td'];

        if ((!hoveredEl.classList.contains(settings.noHoverClass)) && (hoverEls.indexOf(tagName) !== -1)) {
            if (tagName === 'a') {
                hoveredEl = hoveredEl.parentNode;
            }
            if (settings.highlightElement) {
                hoveredEl.classList.add(settings.cellClass);
            }
            if ((settings.highlightRow) || (settings.highlightColumn)) {
                tableRowEls = element.querySelectorAll('tr');
                if (settings.highlightRow) {
                    matchingRowEl = getParentByElName(hoveredEl, 'tr');
                    matchingRowEl.classList.add(settings.rowClass);
                }
                if (settings.highlightColumn) {
                    hoveredIndex = getElIndex(hoveredEl);
                    for (var i = 0; i < tableRowEls.length; i++) {
                        let rowItems = Array.prototype.slice.call(tableRowEls[i].querySelectorAll('th, td'));
                        if (rowItems[hoveredIndex]) {
                            rowItems[hoveredIndex].classList.add(settings.colClass);
                        }
                    }
                }
            }
        }
    };

    function onCellMouseout(e) {
        if ((hoveredEl) && (settings.highlightElement)) {
            hoveredEl.classList.remove(settings.cellClass);
        }
        if ((matchingRowEl) && (settings.highlightRow)) {
            matchingRowEl.classList.remove(settings.rowClass);
        }
        if (settings.highlightColumn) {
            for (var i = 0; i < tableRowEls.length; i++) {
                let rowItems = Array.prototype.slice.call(tableRowEls[i].querySelectorAll('th, td'));
                if (rowItems[hoveredIndex]) {
                    rowItems[hoveredIndex].classList.remove(settings.colClass);
                }
            }
        }
    };

    function getParentByElName(el, elName) {
        let parentEl = el.parentNode;
        if (parentEl === null) {
            return null;
        } else {
            if (parentEl.tagName.toLowerCase() === elName) {
                return parentEl;
            } else {
                getParentByElName(parentEl, elName)
            }
        }
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
        element.removeEventListener('mouseover', onCellMouseover);
        element.removeEventListener('mouseout', onCellMouseout);
    };

    init();

    return {
        destroy: destroy
    }

}

export default hoverTable;