create table users
(
    id             bigserial primary key,
    password       varchar(100),
    email          varchar(100) not null unique,
    first_name     varchar(50),
    last_name      varchar(50),
    avatar_img_url varchar(100),
    description    varchar(500),
    role           varchar(50)
);

create table refresh_token
(
    id          bigserial primary key,
    token       varchar(255) not null,
    expiry_date timestamp    not null,
    user_id     bigint references users (id) on delete cascade
);

create table skills
(
    id        bigserial primary key,
    name      varchar(50) not null unique,
    title     varchar(12) not null unique,
    parent_id bigint      null references skills (id)
);

create table roles
(
    id   bigserial primary key,
    name varchar(50)
);

insert into roles (id, name)
values (1, 'SEARCHER'),
       (2, 'INTERVIEWER'),
       (3, 'HR'),
       (4, 'ADMIN');

create table user_role_skill
(
    id       bigserial primary key,
    user_id  bigint references users (id) on delete cascade,
    role_id  bigint references roles (id),
    skill_id bigint references skills (id)
);

create table interviews
(
    id                bigserial primary key,
    title             varchar(100),
    status            varchar(255) not null,
    interviewer_id    bigint       references users (id) on delete set null,
    searcher_id       bigint       references users (id) on delete set null,
    planned_date_time timestamp,
    start_date_time   timestamp,
    end_date_time     timestamp,
    feedback          varchar(500)
);

create table interview_questions
(
    id           bigserial primary key,
    interview_id bigint references interviews (id) on delete cascade,
    skill_id     bigint references skills (id),
    question     varchar(500),
    grade        int,
    create_at    timestamp
);

create table interviewer_questions
(
    id             bigserial primary key,
    skill_id       bigint references skills (id),
    interviewer_id bigint references users (id) on delete cascade,
    question       varchar(500),
    updated_at     timestamp
);

-- insert skills level 1
INSERT INTO skills (name, title, parent_id)
VALUES ('Programming', 'Programming', NULL),
       ('Database Administration', 'DB Admin', NULL),
       ('Network', 'Network', NULL),
       ('Cybersecurity', 'Cybersecur', NULL);

-- get id for level 1
WITH ParentIDs AS (SELECT id, name
                   FROM skills
                   WHERE parent_id IS NULL)

-- insert skills level 2
INSERT
INTO skills (name, title, parent_id)
SELECT sub.name,
       sub.title,
       ParentIDs.id
FROM ParentIDs
         JOIN (VALUES ('Web Development', 'Web Dev', 'Programming'),
                      ('Mobile Development', 'Mob Dev', 'Programming'),
                      ('Game Development', 'Game Dev', 'Programming'),
                      ('Programming Languages', 'Program Lang', 'Programming'),
                      ('Relational Databases', 'Rel DB', 'Database Administration'),
                      ('NoSQL Databases', 'NoSQL DB', 'Database Administration'),
                      ('Database Design', 'DB Design', 'Database Administration'),
                      ('Network Security', 'Net Secur', 'Network'),
                      ('Network Architecture', 'Net Architec', 'Network'),
                      ('Network Administration', 'Net Admin', 'Network'),
                      ('Ethical Hacking', 'Ethical Hack', 'Cybersecurity'),
                      ('Security Auditing', 'Secur Audit', 'Cybersecurity'),
                      ('Cryptography', 'Cryptography', 'Cybersecurity'),
                      ('Incident Response', 'In Response', 'Cybersecurity')) AS sub(name, title, parent_name)
              ON ParentIDs.name = sub.parent_name;

-- get id for level 2
WITH ParentIDs AS (SELECT id, name
                   FROM skills
                   WHERE parent_id IN (SELECT id FROM skills WHERE parent_id IS NULL))

-- insert skills level 3
INSERT
INTO skills (name, title, parent_id)
SELECT sub.name,
       sub.title,
       ParentIDs.id
FROM ParentIDs
         JOIN (VALUES ('Frontend Development', 'Front Dev', 'Web Development'),
                      ('Backend Development', 'Back Dev', 'Web Development'),
                      ('Full-stack Development', 'Full Dev', 'Web Development'),
                      ('UI/UX Design', 'UI/UX Design', 'Web Development'),
                      ('iOS Development', 'iOS Dev', 'Mobile Development'),
                      ('Android Development', 'Android Dev', 'Mobile Development'),
                      ('Cross-platform Development', 'Cross Dev', 'Mobile Development'),
                      ('Unity Development', 'Unity Dev', 'Game Development'),
                      ('Unreal Engine Development', 'Unreal E Dev', 'Game Development'),
                      ('Mobile Game Development', 'Mob Game Dev', 'Game Development'),
                      ('Java', 'Java', 'Programming Languages'),
                      ('Python', 'Python', 'Programming Languages'),
                      ('C++', 'C++', 'Programming Languages'),
                      ('JavaScript', 'JavaScript', 'Programming Languages'),
                      ('Ruby', 'Ruby', 'Programming Languages'),
                      ('Swift', 'Swift', 'Programming Languages'),
                      ('Kotlin', 'Kotlin', 'Programming Languages'),
                      ('PHP', 'PHP', 'Programming Languages'),
                      ('TypeScript', 'TypeScript', 'Programming Languages'),
                      ('Go', 'Go', 'Programming Languages'),
                      ('Rust', 'Rust', 'Programming Languages'),
                      ('Perl', 'Perl', 'Programming Languages'),
                      ('C#', 'C#', 'Programming Languages'),
                      ('MySQL', 'MySQL', 'Relational Databases'),
                      ('PostgreSQL', 'PostgreSQL', 'Relational Databases'),
                      ('Oracle Database', 'Oracle DB', 'Relational Databases'),
                      ('Microsoft SQL Server', 'MS SQL Serv', 'Relational Databases'),
                      ('SQLite', 'SQLite', 'Relational Databases'),
                      ('MongoDB', 'MongoDB', 'NoSQL Databases'),
                      ('Cassandra', 'Cassandra', 'NoSQL Databases'),
                      ('Redis', 'Redis', 'NoSQL Databases'),
                      ('Couchbase', 'Couchbase', 'NoSQL Databases'),
                      ('Amazon DynamoDB', 'AWS DynamoDB', 'NoSQL Databases'),
                      ('Entity-Relationship Diagrams', 'ERDs', 'Database Design'),
                      ('Normalization', 'Normalizing', 'Database Design'),
                      ('Indexing Strategies', 'Index Strat.', 'Database Design'),
                      ('Data Modeling Tools', 'DM Tools', 'Database Design'),
                      ('Firewall Configuration', 'FW Config', 'Network Security'),
                      ('Intrusion Detection and Prevention Systems', 'IDPS', 'Network Security'),
                      ('VPN Implementation', 'VPN Impl.', 'Network Security'),
                      ('Network Access Control', 'NAC', 'Network Security'),
                      ('Security Information and Event Management', 'SIEM', 'Network Security'),
                      ('Security Policies and Procedures', 'SPP', 'Network Security'),
                      ('LAN/WAN Design', 'LAN/WAN Des.', 'Network Architecture'),
                      ('Routing Protocols (e.g., OSPF, BGP)', 'Rout Prot.', 'Network Architecture'),
                      ('VLAN Configuration', 'VLAN Config', 'Network Architecture'),
                      ('MPLS Networking', 'MPLS Network', 'Network Architecture'),
                      ('Software-Defined Networking', 'SDN', 'Network Architecture'),
                      ('Cloud Networking Architecture', 'Cloud NWArch', 'Network Architecture'),
                      ('Network Configuration', 'NW Config', 'Network Administration'),
                      ('Network Monitoring', 'NW Monitor', 'Network Administration'),
                      ('Performance Optimization', 'Perf. Optim.', 'Network Administration'),
                      ('Troubleshooting', 'Troubleshoot', 'Network Administration'),
                      ('Network Automation', 'NW Automat.', 'Network Administration'),
                      ('Disaster Recovery Planning', 'DRP', 'Network Administration'),
                      ('Footprinting', 'Footprinting', 'Ethical Hacking'),
                      ('Scanning', 'Scanning', 'Ethical Hacking'),
                      ('Enumeration', 'Enumeration', 'Ethical Hacking'),
                      ('System Hacking', 'System Hack', 'Ethical Hacking'),
                      ('Trojans and Backdoors', 'T''n''B', 'Ethical Hacking'),
                      ('Social Engineering', 'Soc Engin', 'Ethical Hacking'),
                      ('Wireless Network Hacking', 'WL NW Hack', 'Ethical Hacking'),
                      ('Vulnerability Assessment', 'VA', 'Security Auditing'),
                      ('Penetration Testing', 'Penetr. Test', 'Security Auditing'),
                      ('Compliance Auditing', 'Compl. Audit', 'Security Auditing'),
                      ('Risk Assessment', 'Risk Assess', 'Security Auditing'),
                      ('Security Policy Review', 'SPR', 'Security Auditing'),
                      ('Symmetric Cryptography', 'Symm Crypto', 'Cryptography'),
                      ('Asymmetric Cryptography', 'Asymm Crypto', 'Cryptography'),
                      ('Hash Functions', 'Hash Func', 'Cryptography'),
                      ('Digital Signatures', 'Dig. Signat.', 'Cryptography'),
                      ('Public Key Infrastructure', 'PKI', 'Cryptography'),
                      ('Cryptanalysis', 'Cryptanalys.', 'Cryptography'),
                      ('Incident Detection', 'Incid Detect', 'Incident Response'),
                      ('Incident Triage', 'Incid Triage', 'Incident Response'),
                      ('Containment and Mitigation', 'C''n''M', 'Incident Response'),
                      ('Forensic Analysis', 'Forensic', 'Incident Response'),
                      ('Reporting and Documentation', 'R''n''D', 'Incident Response')) AS sub(name, title, parent_name)
              ON ParentIDs.name = sub.parent_name;

create table temp_users
(
    id         bigserial primary key,
    email      varchar(100) not null unique,
    password   varchar(100),
    first_name varchar(50),
    last_name  varchar(50),
    expire_at  timestamp
);
