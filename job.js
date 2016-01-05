/**
 * Created by tuananh on 12/26/15.
 */
'use strict';

module.exports = function (sequelize, DataTypes) {

    return sequelize.define("job", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Title cannot too long'
                }
            }
        },
        alias: {
            type: DataTypes.STRING,
            validate: {
                len: {
                    args: [1, 255],
                    msg: 'Alias cannot empty or too long'
                },
                isSlug: function (value) {
                    if (typeof value !== 'string' || !value.match(/[a-zA-Z0-9-_]/g)) {
                        throw new Error('Alias cannot includes special characters!');
                    }
                }
            }
        },
        categories: DataTypes.TEXT,
        skills: DataTypes.TEXT,
        locations: DataTypes.TEXT,
        content: DataTypes.TEXT,
        requirement: DataTypes.TEXT,
        job_company_info: DataTypes.TEXT,
        job_link: DataTypes.STRING,
        salary : DataTypes.STRING,
        source: DataTypes.STRING,
        expires_date: DataTypes.DATE,
        logo_company_url: {
            type: DataTypes.STRING,
            defaultValue: '/img/noImage.png',
            len: {
                args: [0, 255],
                msg: 'Image url is too long'
            }
        },
        published: {
            type: DataTypes.INTEGER,
            validate: {
                isIn: {
                    args: [['0', '1']],
                    msg: 'Invalid data type'
                }
            }
        },
        published_at: {
            type: DataTypes.DATE,
            validate: {
                isDate: {
                    msg: 'Please input datetime value'
                }
            }
        },
        created_at: {
            type: DataTypes.DATE,
            validate: {
                isDate: {
                    msg: 'Invalid date value'
                }
            }
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        modified_at: {
            type: DataTypes.DATE,
            validate: {
                isDate: {
                    msg: 'Invalid date value'
                }
            }
        },
        modified_by: {
            type: DataTypes.INTEGER
        }
    }, {
        tableName: 'job',
        createdAt: 'created_at',
        updatedAt: 'modified_at'
    });

};