export var nodedata = [
    {
        key: 1,
        name: 'BankAccount',
        properties: [
            {
                name: 'owner',
                type: 'String',
                visibility: 'public'
            },
            {
                name: 'balance',
                type: 'Currency',
                visibility: 'public',
                //default: '0'
            }
        ],
        methods: [
            {
                name: 'deposit',
                parameters: [
                    {
                        name: 'amount',
                        type: 'Currency'
                    }
                ],
                visibility: 'public'
            },
            {
                name: 'withdraw',
                parameters: [
                    {
                        name: 'amount',
                        type: 'Currency'
                    }
                ],
                visibility: 'private'
            }
        ]
    },
    // ...resto de tus datos
    {
        key: 11,
        name: 'Person',
        properties: [
            { name: 'name', type: 'String', visibility: 'public' },
            { name: 'birth', type: 'Date', visibility: 'protected' }
        ],
        methods: [
            { name: 'getCurrentAge', type: 'int', visibility: 'public' }
        ]
    },
];