//knockout binding
(function ($) {
    ko.bindingHandlers.grid = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            var value = valueAccessor();
            var allBindings = allBindingsAccessor();
            var options = allBindings.grid.options ||
                { datatype: 'local', colModel: [], colNames: [], height: 'auto', altRows: true };
            $(element).tabletogrid(value, options);
            //subscribeToSelectEvents(element, value);
        },
        update: function (element, valueAccessor, allBindingsAccessor) {
            var value = valueAccessor();
            var griddata = value.data();
            $(element).clearGridData().setGridParam({ data: ko.toJS(griddata) }).trigger('reloadGrid');
            clearSelectedItems(value);
            //subscribeToSelectEvents(element, value);
        }
    };

    function clearSelectedItems(value) {
        if (value.selectedItems) {
            value.selectedItems([]);
        };
    }

    function subscribeToSelectEvents(element, value) {
        var idParamName = $(element).getRowId();
        $(element).jqGrid('setGridParam', {
            onSelectRow: function (id, selected) {
                var countries = ko.toJS(value.data());
                var selectedItem = ko.utils.arrayFirst(value.data(), function (item) { return item[idParamName] == id; });
                //var selectedItem = ko.toJS(value.data())[id - 1];
                //var selectedItem = value.data()[id - 1];
                //var unbox = selectedItem();
                debugger;
                //                if (value.selectedItem && selected) {
                //                    value.selectedItem(selectedItem);
                //                }
                //                if (value.onSelectRow && selected) {
                //                    value.onSelectRow(id);
                //                }
                //                if (value.selectedItems) {
                //                    selected ? value.selectedItems.push(selectedItem) : value.selectedItems.remove(selectedItem);
                //                }
            }
        });
        $(element).jqGrid('setGridParam', {
            onSelectAll: function (ids, selected) {
                if (selected) {
                    value.selectedItems(ko.utils.arrayFilter(value.data(), function (item) {
                        return $.inArray(item[idParamName], ids) != -1;
                    }));
                }
                else {
                    value.selectedItems.removeAll();
                }
            }
        });
    }

    $.fn.getRowId = function () {
        return $(this).getGridParam('localReader').id;
    };

    $.fn.tabletogrid = function (settings, options) {
        settings = settings || {};
        $(this).each(function () {
            if (this.grid) { return; }
            var element = $(this).width('99%'),
                pagerOptions = settings.pager || { target: '#pager', rowNum: 10, rowList: [10, 20, 50] },
                idParamName = settings.rowid || 'id';

            pagerOptions.pager = $(pagerOptions.target).length == 0 ? null : pagerOptions.target;
            $.extend(options, pagerOptions, { width: element.width(), caption: $('caption', element).text(), localReader: { id: idParamName} });

            buildColModel(element, options);
            element.empty().jqGrid(options);
        });
    };

    function buildColModel(element, options) {
        var templates = $('td', element);
        $('th', element).each(function () {
            var source = $(this),
                col = source.attr('id') || source.data().field || $.trim($.jgrid.stripHtml(source.html())).split(' ').join('_'),
                model = { name: col, index: col, width: source.width() },
                template = templates.filter('[data-field="' + model.index + '"]');
            $.extend(model, source.data());
            if (template.length > 0) {
                model.template = template;
                model.formatter = knockoutTemplate;
            }
            options.colModel.push(model);
            options.colNames.push(source.html());
        });
    }

    function knockoutTemplate(cellval, opts, rwd) {
        if (opts.colModel[0]) {
            var element = $(opts.colModel[0]).clone().prepend('<!-- ko with: ' + ko.toJSON(rwd) + ' -->').append('<!-- /ko -->');
            ko.applyBindings(rwd, element[0]);
            return element.html();
        }
        return cellval;
    };
})(jQuery);