import * as Metrika from '@ips/app/metrika';
import * as GTM from '@ips/app/google-tag-manager';

// analytic events

export const subratingClick = (subrating_click) => {
  //trace('subratingClick', subrating_click)
  GTM.event('subrating_click', { subrating_click });
  Metrika.event('subrating_click', { subrating_click });
};

export const tableExpand = (table_expand) => {
  //trace('tableExpand', table_expand)
  GTM.event('table_expand', { table_expand });
  Metrika.event('table_expand', { table_expand });
};

