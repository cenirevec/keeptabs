export class searchBarParameters{
    /** Values entered in the searchbar */
    values = [''];
    /** The list of options the searchbar can set */
    options = {
        /** Defines whether the regular expression feature is enabled or not */
        regularExpressions : false,
        /** Defines whether the filter exclude the entered values or not */
        revertSelection : false
    }
}