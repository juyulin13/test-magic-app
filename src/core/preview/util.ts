import update from 'immutability-helper';
export const onUpdate = (cards, key, card) => {
  const { atGroup, atSalary, atField, group, salary, field } = key;
  const add = update(
    cards,
    typeof atSalary !== 'undefined'
      ? {
          [atGroup]: {
            children:
              typeof atField !== 'undefined'
                ? {
                    [atSalary]: {
                      children: {
                        $splice: [[atField, 0, card]],
                      },
                    },
                  }
                : {
                    $splice: [[atSalary, 0, card]],
                  },
          },
        }
      : typeof atGroup !== 'undefined'
      ? { $splice: [[atGroup, 0, card]] }
      : {},
  );
  const result = update(
    add,
    typeof salary !== 'undefined'
      ? {
          [group]: {
            children:
              typeof field !== 'undefined'
                ? {
                    [salary]: {
                      children: {
                        $splice: [[field, 1]],
                      },
                    },
                  }
                : {
                    $splice: [[salary, 1]],
                  },
          },
        }
      : typeof group !== 'undefined'
      ? { $splice: [[group, 1]] }
      : {},
  );
  return result;
};