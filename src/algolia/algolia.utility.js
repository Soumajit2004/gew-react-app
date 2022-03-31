import algoliasearch from 'algoliasearch/lite';

const client = algoliasearch('4V6X98Y2PB', '6c6ef9a8e377cd8680171e5fe01e64c7')

export const poIndex = client.initIndex("poSearch");