import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_KEY,
);

export { supabase };


// https://u27092108.ct.sendgrid.net/ls/click?upn=K9CIcsJXqD3GVilW5Pvw57hmDh6WytlNEjQ2DcIVPgpI70N9Qwql1JKwZETUosbap6iS_6U3AlnyvMxxXqGK2YZZvqUJVUttFFJpTMFEfsvSxxfS9-2BhzXuzNHkIM72fRNnlyERXwBG0u4W5x70dVsVor5YoXUioS2RBf6vpeIHjkOmAYMrfdK77tAxGmd-2Fi4NP7cgZN4VwgtGsmYs-2FTCX1DhDG5pfPw7MN7TzgIfATkk9PspDdge7U0XpqwwS9W7AkTSbJhhn1iIY7CSZZGEYBqaIcU6YqtonBzxITR62DjA-2FATQ-3D