import { Order_Direction, useListLabelHistoryQuery } from '../../../__generated__/graphql';
import BackButton from '../../../components/BackButton';
import NotFoundItem from '../../../components/NotFoundItem';
import SteriLabel from '../../../components/SteriLabel/SteriLabel';
import { Button } from '../../../components/ui/button';
import { PageLimit } from '../../../constants';

function LabelHistoryScreen() {
    const {
        loading,
        data,
        refetch,
    } = useListLabelHistoryQuery({
        variables: {
            offset: 0,
            limit: PageLimit,
            order_by: {
                column: 'id',
                direction: Order_Direction.Desc,
            }
        },
    })

    const labels = data?.steri_label || [];

    return (
        <div className='my-6 container'>
            <div className='flex items-center mb-4'>
                <BackButton href='/settings' />
                <p className='ml-2 font-bold text-gray-500'>Steri Labels</p>
                <div className='flex-1' />
            </div>

            <Button onClick={() => refetch()}>Refresh</Button>


            <div className='grid grid-cols-2 gap-4'>
                {labels.map(label => <SteriLabel
                    item={label}
                    key={label.id}
                />)}
            </div>
            {labels.length === 0 && !loading && <NotFoundItem title='No labels found' noBack />}

        </div>
    )

}

export default LabelHistoryScreen


// CREATE OR REPLACE FUNCTION fn_stericycle_add_item()
// RETURNS trigger
// LANGUAGE plpgsql AS
// $BODY$
// Begin
// Update steri_label
// Set steri_cycle_user_id = NEW.clinic_user_id,
// loaded_at = NEW.created_at,
// steri_cycle_id = NEW.data->>steri_cycle_id
// WHERE id = NEW.steri_label_id;
// RETURN NEW;
// END;
// $BODY$

// CREATE TRIGGER trigger_stericycle_add_item
// AFTER INSERT 
// ON steri_label_event
// FOR EACH ROW
// WHEN ((NEW.type)::text = 'stericycle_additem'::text)
// EXECUTE PROCEDURE fn_stericycle_add_item(); 